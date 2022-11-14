import { UsePipes } from '@nestjs/common';

import { MqttGateway, MqttValidationPipe } from '../../nestjs-mqtt';

import { GatewaysService } from './gateways.service';

@MqttGateway('gateways')
@UsePipes(new MqttValidationPipe())
export class GatewaysMqttController {
  constructor(private readonly gatewaysService: GatewaysService) {}
}
