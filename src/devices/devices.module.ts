import { Module } from '@nestjs/common';

import { GatewaysModule } from './gateways/gateways.module';
import { AnchorsModule } from './anchors/anchors.module';
import { TagsModule } from './tags/tags.module';

@Module({
  imports: [GatewaysModule, AnchorsModule, TagsModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class DevicesModule {}
