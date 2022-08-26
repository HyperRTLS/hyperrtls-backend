import { IsNumber } from 'class-validator';

import { Controller, UsePipes } from '@nestjs/common';

import {
  MqttGateway,
  MqttValidationPipe,
  MqttSubscribe,
  Payload,
  Topic,
} from 'src/nestjs-mqtt';

import { MqttNodeService } from './node.service';

export class NodeLocationPayload {
  @IsNumber()
  x: number;

  @IsNumber()
  y: number;

  @IsNumber()
  z: number;
}

@Controller()
@MqttGateway('nodes')
@UsePipes(new MqttValidationPipe())
export class MqttNodeController {
  constructor(private readonly mqttNodeService: MqttNodeService) {}

  @MqttSubscribe('+nodeId/location')
  onLocationData(
    @Topic('nodeId') nodeId: string,
    @Payload() payload: NodeLocationPayload,
  ) {
    this.mqttNodeService.pushLocationEvent({ nodeId, ...payload });
  }
}
