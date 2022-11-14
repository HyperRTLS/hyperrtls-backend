import { Options } from '@mikro-orm/core';

import { BaseDeviceEntity } from './devices/base/base.entity';
import { GatewayEntity } from './devices/gateways/gateway.entity';
import { AnchorEntity } from './devices/anchors/anchor.entity';
import { TagEntity } from './devices/tags/tag.entity';
import { PositionEntity } from './devices/tags/position.entity';

const MikroOrmConfig: Options = {
  entities: [
    BaseDeviceEntity,
    GatewayEntity,
    AnchorEntity,
    TagEntity,
    PositionEntity,
  ],
  type: 'postgresql',
  clientUrl: process.env.DATABASE_URL,
};

export default MikroOrmConfig;
