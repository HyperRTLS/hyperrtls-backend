import {
  Client,
  IConnackPacket,
  IDisconnectPacket,
  IPublishPacket,
  IPacket,
} from 'mqtt';

export interface OnMqttGatewayConnect {
  onMqttGatewayConnect(client: Client, packet: IConnackPacket): any;
}

export interface OnMqttGatewayReconnect {
  onMqttGatewayReconnect(client: Client): any;
}

export interface OnMqttGatewayClose {
  onMqttGatewayClose(client: Client): any;
}

export interface OnMqttGatewayDisconnect {
  onMqttGatewayDisconnect(client: Client, packet: IDisconnectPacket): any;
}

export interface OnMqttGatewayOffline {
  onMqttGatewayOffline(client: Client): any;
}

export interface OnMqttGatewayError {
  onMqttGatewayError(client: Client, error: Error): any;
}

export interface OnMqttGatewayEnd {
  onMqttGatewayEnd(client: Client): any;
}

export interface OnMqttGatewayMessage {
  onMqttGatewayMessage(
    client: Client,
    topic: string,
    message: Buffer,
    packet: IPublishPacket,
  ): any;
}

export interface OnMqttGatewayPacketSend {
  onMqttGatewayPacketSend(client: Client, packet: IPacket): any;
}

export interface OnMqttGatewayPacketReceive {
  onMqttGatewayPacketReceive(client: Client, packet: IPacket): any;
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
