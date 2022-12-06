import { UsePipes } from '@nestjs/common';

import {
  MqttGateway,
  MqttValidationPipe,
  MqttSubscribe,
  Payload,
  Topic,
} from '../../nestjs-mqtt';

import { IsNumber } from 'class-validator';

import { TagsService } from './tags.service';

export class TagPositionPayload {
  @IsNumber({}, { each: true })
  position: [number, number, number];
}

@MqttGateway('gateways/+gatewayId/tags')
@UsePipes(new MqttValidationPipe())
export class TagsMqttController {
  constructor(private readonly tagsService: TagsService) {}

  @MqttSubscribe('+tagId/position')
  async onPositionMessage(
    @Topic('tagId') tagId: string,
    @Payload() payload: TagPositionPayload,
  ) {
    await this.tagsService.onPositionMessage(tagId, payload.position);
  }
}
