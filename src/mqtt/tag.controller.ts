import { IsNumber } from 'class-validator';

import { UsePipes } from '@nestjs/common';

import {
  MqttGateway,
  MqttValidationPipe,
  MqttSubscribe,
  Payload,
  Topic,
} from '../nestjs-mqtt';

import { MqttTagService } from './tag.service';

export class TagLocationPayload {
  @IsNumber()
  x: number;

  @IsNumber()
  y: number;

  @IsNumber()
  z: number;
}

@MqttGateway('tags')
@UsePipes(new MqttValidationPipe())
export class MqttTagController {
  constructor(private readonly mqttTagService: MqttTagService) {}

  @MqttSubscribe('+tagId/ping')
  onPing(@Topic('tagId') tagId: string) {
    this.mqttTagService.pushPingEvent(tagId, {
      timestamp: new Date().getTime(),
    });
  }

  @MqttSubscribe('+tagId/location')
  onLocationData(
    @Topic('tagId') tagId: string,
    @Payload() payload: TagLocationPayload,
  ) {
    this.mqttTagService.pushLocationEvent(tagId, payload);
  }
}
