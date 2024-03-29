import { UsePipes } from '@nestjs/common';

import { MqttGateway, MqttValidationPipe } from '../../nestjs-mqtt';

import { AnchorsService } from './anchors.service';

@MqttGateway('gateways/+gatewayId/anchors')
@UsePipes(new MqttValidationPipe())
export class AnchorsMqttController {
  constructor(private readonly anchorsService: AnchorsService) {}
}
