import { UsePipes } from '@nestjs/common';

import {
  MqttGateway,
  MqttValidationPipe,
  MqttSubscribe,
  Topic,
} from '../nestjs-mqtt';

import { MqttGatewayService } from './gateway.service';

@MqttGateway('gateways')
@UsePipes(new MqttValidationPipe())
export class MqttGatewayController {
  constructor(private readonly mqttGatewayService: MqttGatewayService) {}

  @MqttSubscribe('+gatewayId/ping')
  onPing(@Topic('gatewayId') gatewayId: string) {
    this.mqttGatewayService.pushPingEvent(gatewayId, {
      timestamp: new Date().getTime(),
    });
  }
}
