import { Controller } from '@nestjs/common';

import { MqttGateway } from 'src/nestjs-mqtt';

import { MqttGatewayService } from './gateway.service';

@Controller()
@MqttGateway()
export class MqttGatewayController {
  constructor(private readonly mqttGatewayService: MqttGatewayService) {}
}
