import { Module } from '@nestjs/common';

import { MikroOrmModule } from '@mikro-orm/nestjs';

import { GatewayEntity } from './gateway.entity';

import { GatewaysRestController } from './gateways.rest.controller';
import { GatewaysMqttController } from './gateways.mqtt.controller';

import { GatewaysService } from './gateways.service';

import { GatewaysEventBus } from './gateways.eventBus';

@Module({
  imports: [MikroOrmModule.forFeature([GatewayEntity])],
  controllers: [GatewaysRestController],
  providers: [GatewaysMqttController, GatewaysService, GatewaysEventBus],
  exports: [GatewaysService, GatewaysEventBus],
})
export class GatewaysModule {}
