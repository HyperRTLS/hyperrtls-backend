import { MqttGateway } from '../nestjs-mqtt';

import { MqttGatewayService } from './gateway.service';

@MqttGateway()
export class MqttGatewayController {
  constructor(private readonly mqttGatewayService: MqttGatewayService) {}
}
