import { Injectable } from '@nestjs/common';

import { MikroORM } from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/postgresql';
import { InjectRepository } from '@mikro-orm/nestjs';

import { AnchorEntity } from './anchor.entity';

import { AnchorsEventBus } from './anchors.eventBus';

@Injectable()
export class AnchorsService {
  constructor(
    private readonly orm: MikroORM,
    @InjectRepository(AnchorEntity)
    private readonly anchorRepository: EntityRepository<AnchorEntity>,
    private readonly anchorsEventBus: AnchorsEventBus,
  ) {}
}
