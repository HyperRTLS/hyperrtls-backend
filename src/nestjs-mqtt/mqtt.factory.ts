import { IPacket, MqttClient } from 'mqtt';

import { SubscriberParamType } from './decorators';

import { ParsedTopic } from './utils';

export type MqttSubscriberArgs = [MqttClient, ParsedTopic, Buffer, IPacket];

export class MqttSubscriberParamsFactory {
  public exchangeKeyForValue(
    type: SubscriberParamType,
    data: unknown,
    [client, topic, payload, packet]: MqttSubscriberArgs,
  ) {
    switch (type) {
      case SubscriberParamType.CLIENT:
        return client;
      case SubscriberParamType.TOPIC:
        switch (typeof data) {
          case 'number':
            return topic.all[data];
          case 'string':
            return topic.named[data];
          default:
            return topic.raw;
        }
      case SubscriberParamType.PAYLOAD:
        return payload;
      case SubscriberParamType.PACKET:
        return packet;
    }
  }
}
