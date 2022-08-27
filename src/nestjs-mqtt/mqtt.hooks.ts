import {
  Client,
  IConnackPacket,
  IDisconnectPacket,
  IPublishPacket,
  IPacket,
} from 'mqtt';

export interface OnMqttGatewayConnect {
  onMqttGatewayConnect(client: Client, packet: IConnackPacket): void;
}

export interface OnMqttGatewayReconnect {
  onMqttGatewayReconnect(client: Client): void;
}

export interface OnMqttGatewayClose {
  onMqttGatewayClose(client: Client): void;
}

export interface OnMqttGatewayDisconnect {
  onMqttGatewayDisconnect(client: Client, packet: IDisconnectPacket): void;
}

export interface OnMqttGatewayOffline {
  onMqttGatewayOffline(client: Client): void;
}

export interface OnMqttGatewayError {
  onMqttGatewayError(client: Client, error: Error): void;
}

export interface OnMqttGatewayEnd {
  onMqttGatewayEnd(client: Client): void;
}

export interface OnMqttGatewayMessage {
  onMqttGatewayMessage(
    client: Client,
    topic: string,
    message: Buffer,
    packet: IPublishPacket,
  ): void;
}

export interface OnMqttGatewayPacketSend {
  onMqttGatewayPacketSend(client: Client, packet: IPacket): void;
}

export interface OnMqttGatewayPacketReceive {
  onMqttGatewayPacketReceive(client: Client, packet: IPacket): void;
}

export const hookToEventMapping = {
  onMqttGatewayConnect: 'connect',
  onMqttGatewayReconnect: 'reconnect',
  onMqttGatewayClose: 'close',
  onMqttGatewayDisconnect: 'disconnect',
  onMqttGatewayOffline: 'offline',
  onMqttGatewayError: 'error',
  onMqttGatewayEnd: 'end',
  onMqttGatewayMessage: 'message',
  onMqttGatewayPacketSend: 'packetsend',
  onMqttGatewayPacketReceive: 'packetreceive',
};
