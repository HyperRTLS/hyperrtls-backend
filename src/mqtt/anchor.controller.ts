import { UsePipes } from '@nestjs/common';

import {
  MqttGateway,
  MqttValidationPipe,
  MqttSubscribe,
  Topic,
} from '../nestjs-mqtt';

import { MqttAnchorService } from './anchor.service';

@MqttGateway('anchors')
@UsePipes(new MqttValidationPipe())
export class MqttAnchorController {
  constructor(private readonly mqttAnchorService: MqttAnchorService) {}

  @MqttSubscribe('+anchorId/ping')
  onPing(@Topic('anchorId') anchorId: string) {
    this.mqttAnchorService.pushPingEvent(anchorId, {
      timestamp: new Date().getTime(),
    });
  }
}
