import { Injectable, NotFoundException } from '@nestjs/common';

import {
  MikroORM,
  EntityData,
  QueryOrder,
  wrap,
  QBFilterQuery,
} from '@mikro-orm/core';

import { EntityRepository } from '@mikro-orm/postgresql';
import { InjectRepository } from '@mikro-orm/nestjs';

import { AnchorEntity } from './anchor.entity';

import { AnchorsEventBus } from './anchors.eventBus';

type GetOptions = unknown;

type CreateAnchorData = {
  id: string;
  name: string;
  position: [number, number, number];
};

@Injectable()
export class AnchorsService {
  constructor(
    private readonly orm: MikroORM,
    @InjectRepository(AnchorEntity)
    private readonly anchorRepository: EntityRepository<AnchorEntity>,
    private readonly anchorsEventBus: AnchorsEventBus,
  ) {}

  public get(filter?: QBFilterQuery<AnchorEntity>, _options?: GetOptions) {
    const qb = this.anchorRepository.createQueryBuilder('a');

    if (filter) qb.where(filter);

    return qb.orderBy([{ id: QueryOrder.ASC }]).getResultList();
  }

  public async getOneById(id: string, options?: GetOptions) {
    const results = await this.get({ id }, options);

    if (results.length === 0) {
      throw new NotFoundException();
    }

    return results[0];
  }

  public async create(data: CreateAnchorData) {
    const newAnchor = new AnchorEntity(data.id, data.name, data.position);
    await this.anchorRepository.persistAndFlush(newAnchor);
    return newAnchor;
  }

  public async deleteById(id: string) {
    const anchorEntityReference = this.anchorRepository.getReference(id);

    await this.anchorRepository.removeAndFlush(anchorEntityReference);
  }

  public async update(
    id: string,
    data: Pick<EntityData<AnchorEntity>, 'name' | 'position'>,
  ) {
    const anchorEntityReference = this.anchorRepository.getReference(id);

    wrap(anchorEntityReference).assign(data);

    await this.anchorRepository.flush();
  }

  public getEventStream(filters?: {
    deviceIds?: Array<string>;
    eventTypes?: Array<string>;
  }) {
    return this.anchorsEventBus.toObservable(filters);
  }
}
