import { Inject, Injectable, Logger } from '@nestjs/common';

import { v4 as uuidv4 } from 'uuid';
import * as mqtt from 'mqtt';

import {
  DynamicSecurityModuleConfig,
  MODULE_OPTIONS_TOKEN,
} from './dynsec.module-definition';

interface ResponseMessage {
  responses: {
    command: string;
    data?: Record<string, unknown>;
    error?: string;
    correlationData?: string;
  }[];
}

type ResponseListener = (
  error?: string,
  data?: Record<string, unknown>,
) => void;

@Injectable()
export class DynamicSecurityController {
  constructor(
    @Inject(MODULE_OPTIONS_TOKEN)
    private readonly config: DynamicSecurityModuleConfig,
  ) {}

  private readonly logger = new Logger(DynamicSecurityController.name);

  private client: mqtt.MqttClient;
  private readonly responseListeners = new Map<string, ResponseListener>();

  public async init() {
    this.logger.log('Connecting to the MQTT broker...');
    this.client = await this.connect(
      this.config.brokerUrl,
      this.config.clientConfig,
    );

    this.logger.log('Subscribing to Dynamic Security responses topic...');
    this.subscribe('$CONTROL/dynamic-security/v1/response');

    this.client.on('message', this.onResponse.bind(this));

    this.logger.log('Successfully established connection');
  }

  public get mqttClient() {
    return this.client;
  }

  private connect(brokerUrl: string, opts?: mqtt.IClientOptions) {
    return new Promise<mqtt.MqttClient>((resolve, reject) => {
      const client = mqtt.connect(brokerUrl, opts);

      client.on('connect', () => resolve(client));
      client.on('error', (error) => reject(error));
    });
  }

  private subscribe(topic: string) {
    return new Promise<mqtt.ISubscriptionGrant[]>((resolve, reject) => {
      this.client.subscribe(topic, (error, grants) => {
        if (error) return reject(error);
        resolve(grants);
      });
    });
  }

  private publish(topic: string, message: string | Buffer) {
    return new Promise<mqtt.Packet | undefined>((resolve, reject) => {
      this.client.publish(topic, message, (error, packet) => {
        if (error) return reject(error);
        resolve(packet);
      });
    });
  }

  private registerResponseListener(id: string, callback: ResponseListener) {
    this.responseListeners.set(id, callback);
  }

  private removeResponseListener(id: string) {
    this.responseListeners.delete(id);
  }

  private onResponse(_topic: string, payload: Buffer) {
    const parsedPayload = JSON.parse(payload.toString()) as ResponseMessage;
    parsedPayload.responses.forEach((response) => {
      if (!response.correlationData) return;

      const listener = this.responseListeners.get(response.correlationData);
      if (!listener) return;

      this.removeResponseListener(response.correlationData);
      listener(response.error, response.data);
    });
  }

  private responseTimeout(timeout: number) {
    return new Promise<never>((_resolve, reject) => {
      setTimeout(() => {
        reject(new Error('Command timed out'));
      }, timeout);
    });
  }

  public async sendCommand<Request, Response>(
    commandName: string,
    request: Request,
    timeout = 5e3,
  ) {
    const id = uuidv4();
    const payload = {
      commands: [
        {
          ...request,
          command: commandName,
          correlationData: id,
        },
      ],
    };

    const responsePromise = new Promise((resolve, reject) => {
      const callback: ResponseListener = (error, data) => {
        if (error) return reject(error);
        resolve(data);
      };

      this.registerResponseListener(id, callback);
    });

    await this.publish('$CONTROL/dynamic-security/v1', JSON.stringify(payload));

    return Promise.race([
      responsePromise,
      this.responseTimeout(timeout),
    ]) as Promise<Response>;
  }
}
