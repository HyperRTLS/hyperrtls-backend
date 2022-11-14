import { Module } from '@nestjs/common';

import { MikroOrmModule } from '@mikro-orm/nestjs';

import { AnchorEntity } from './anchor.entity';

import { AnchorsRestController } from './anchors.rest.controller';
import { AnchorsMqttController } from './anchors.mqtt.controller';

import { AnchorsService } from './anchors.service';

import { AnchorsEventBus } from './anchors.eventBus';

@Module({
  imports: [MikroOrmModule.forFeature([AnchorEntity])],
  controllers: [AnchorsRestController],
  providers: [AnchorsMqttController, AnchorsService, AnchorsEventBus],
  exports: [AnchorsService, AnchorsEventBus],
})
export class AnchorsModule {}
