import { Injectable } from '@nestjs/common';

import { MikroORM } from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/postgresql';
import { InjectRepository } from '@mikro-orm/nestjs';

import { GatewayEntity } from './gateway.entity';

import { GatewaysEventBus } from './gateways.eventBus';

@Injectable()
export class GatewaysService {
  constructor(
    private readonly orm: MikroORM,
    @InjectRepository(GatewayEntity)
    private readonly gatewayRepository: EntityRepository<GatewayEntity>,
    private readonly gatewaysEventBus: GatewaysEventBus,
  ) {}
}
