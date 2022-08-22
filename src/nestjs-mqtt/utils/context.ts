import { ArgumentsHost } from '@nestjs/common';
import { IPacket, MqttClient } from 'mqtt';
import { ParsedTopic } from './topic';

export function switchToMqtt(host: ArgumentsHost) {
  return {
    getClient: () => host.getArgByIndex(0) as MqttClient,
    getTopic: () => host.getArgByIndex(1) as ParsedTopic,
    getPayload: () => host.getArgByIndex(2) as Buffer,
    getPacket: () => host.getArgByIndex(3) as IPacket,
  };
}
