import { Module } from '@nestjs/common';

import { MikroOrmModule } from '@mikro-orm/nestjs';

import { TagEntity } from './tag.entity';
import { PositionEntity } from './position.entity';

import { TagsRestController } from './tags.rest.controller';
import { TagsMqttController } from './tags.mqtt.controller';

import { TagsService } from './tags.service';

import { TagsEventBus } from './tags.eventBus';

@Module({
  imports: [MikroOrmModule.forFeature([TagEntity, PositionEntity])],
  controllers: [TagsRestController],
  providers: [TagsMqttController, TagsService, TagsEventBus],
  exports: [TagsService, TagsEventBus],
})
export class TagsModule {}
