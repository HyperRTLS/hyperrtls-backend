import * as path from 'path';
import * as mqtt from 'mqtt';
import iterate from 'iterare';

import { Inject } from '@nestjs/common';
import { ExternalContextCreator } from '@nestjs/core/helpers/external-context-creator';

import { MqttGatewayModuleConfig } from './mqtt.module-definition';

import { MqttExplorer } from './mqtt.explorer';
import { MqttSubscriberParamsFactory } from './mqtt.factory';
import { hookToEventMapping } from './mqtt.hooks';

import {
  GATEWAY_MODULE_CONFIG,
  GATEWAY_CLASS_DECORATOR_PARAM,
  SUBSCRIBE_METHOD_PARAM_DECORATOR,
  SUBSCRIBE_METHOD_DECORATOR_PARAM,
} from './mqtt.constants';

import {
  DiscoveredComponent,
  DiscoveredComponentMethod,
  DiscoveredComponentProperty,
} from './utils/explorer';

import {
  ParsedTopic,
  createPatternMatcher,
  createTopicParser,
  getMinimalPatternSubset,
  transformPatternToSubscriptionTopic,
} from './utils/topic';

export interface MessageHandler {
  pattern: string;
  callback: (...args: any[]) => Promise<any>;
  patternMatcher: (topic: string) => boolean;
  topicParser: (topic: string) => ParsedTopic;
}

export class MqttController {
  private gateways: DiscoveredComponent[] = [];
  private clientInjections: DiscoveredComponentProperty[] = [];
  private subscribers: DiscoveredComponentMethod[] = [];
  private messageHandlers: MessageHandler[] = [];

  private client: mqtt.MqttClient;

  constructor(
    @Inject(GATEWAY_MODULE_CONFIG)
    private readonly config: MqttGatewayModuleConfig,
    private readonly mqttExplorer: MqttExplorer,
    private readonly mqttSubscriberParamsFactory: MqttSubscriberParamsFactory,
    private readonly externalContextCreator: ExternalContextCreator,
  ) {}

  init() {
    this.gateways = this.mqttExplorer.discoverGateways(
      this.config.discoverControllers,
    );

    this.clientInjections = this.mqttExplorer.discoverClientInjections(
      this.gateways,
    );

    this.subscribers = this.mqttExplorer.discoverSubscribers(this.gateways);

    this.messageHandlers = this.createMessageHandlers();

    this.client = mqtt.connect(this.config.brokerUrl, this.config.clientConfig);
    this.attachHooks();
    this.subscribeToMessages();
    this.injectClientInstances();
  }

  private createMessageHandlers(): MessageHandler[] {
    return this.subscribers.map((subscriber) => {
      const gatewayPattern = Reflect.getMetadata(
        GATEWAY_CLASS_DECORATOR_PARAM,
        subscriber.parentComponent.instanceWrapper.metatype,
      );

      const subscriberPattern = Reflect.getMetadata(
        SUBSCRIBE_METHOD_DECORATOR_PARAM,
        subscriber.callback,
      );

      const pattern = path.join(gatewayPattern, subscriberPattern);

      const callback = this.externalContextCreator.create(
        subscriber.parentComponent.instanceWrapper.instance,
        subscriber.callback,
        subscriber.name,
        SUBSCRIBE_METHOD_PARAM_DECORATOR,
        this.mqttSubscriberParamsFactory,
        undefined,
        undefined,
        {
          filters: this.config.enableFilters,
          guards: this.config.enableGuards,
          interceptors: this.config.enableInterceptors,
        },
        'mqtt',
      );

      return {
        pattern,
        callback,
        patternMatcher: createPatternMatcher(pattern),
        topicParser: createTopicParser(pattern),
      };
    });
  }

  private attachHooks() {
    this.gateways.forEach((gateway) => {
      const instance = gateway.instanceWrapper.instance;

      Object.entries(hookToEventMapping).forEach(([hookName, eventName]) => {
        const hook = instance[hookName];
        if (!hook) return;
        this.client.on(eventName, hook.bind(instance, this.client));
      });
    });
  }

  private injectClientInstances() {
    this.clientInjections.forEach((injection) => {
      injection.parentComponent.instanceWrapper.instance[injection.name] =
        this.client;
    });
  }

  private subscribeToMessages() {
    this.client.on('message', (topic, payload, packet) => {
      iterate(this.messageHandlers)
        .filter(({ patternMatcher }) => patternMatcher(topic))
        .forEach(({ callback, topicParser }) => {
          const parsedTopic = topicParser(topic);
          callback(this.client, parsedTopic, payload, packet).catch((err) => {
            if (!this.config.suppressRoutesErrors) throw err;
          });
        });
    });

    getMinimalPatternSubset(
      this.messageHandlers.map((handler) => handler.pattern),
    )
      .map(transformPatternToSubscriptionTopic)
      .forEach((topic) => this.client.subscribe(topic));
  }
}
