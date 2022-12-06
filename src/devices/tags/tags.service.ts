import { Injectable, NotFoundException } from '@nestjs/common';

import {
  MikroORM,
  UseRequestContext,
  EntityData,
  QueryOrder,
  wrap,
  QBFilterQuery,
} from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/postgresql';
import { InjectRepository } from '@mikro-orm/nestjs';

import { TagEntity } from './tag.entity';
import { PositionEntity } from './position.entity';

import { TagsEventBus } from './tags.eventBus';

type GetOptions = {
  includeAllPositions?: boolean;
};

type CreateTagData = {
  id: string;
  name: string;
};

@Injectable()
export class TagsService {
  constructor(
    private readonly orm: MikroORM,
    @InjectRepository(TagEntity)
    private readonly tagRepository: EntityRepository<TagEntity>,
    private readonly tagsEventBus: TagsEventBus,
  ) {}

  public get(filter?: QBFilterQuery<TagEntity>, options?: GetOptions) {
    const qb = this.tagRepository.createQueryBuilder('t');

    if (filter) qb.where(filter);

    if (!options?.includeAllPositions)
      qb.select(qb.raw('distinct on (t.id) NULL'));

    return qb
      .addSelect('*')
      .leftJoinAndSelect('positions', 'p')
      .orderBy([{ id: QueryOrder.ASC }, { positions: { id: QueryOrder.DESC } }])
      .getResultList();
  }

  public async getOneById(id: string, options?: GetOptions) {
    const results = await this.get({ id }, options);

    if (results.length === 0) {
      throw new NotFoundException();
    }

    return results[0];
  }

  public async create(data: CreateTagData) {
    const newTag = new TagEntity(data.id, data.name);
    await this.tagRepository.persistAndFlush(newTag);
    return newTag;
  }

  public async deleteById(id: string) {
    const tagEntityReference = this.tagRepository.getReference(id);

    await this.tagRepository.removeAndFlush(tagEntityReference);
  }

  public async update(id: string, data: Pick<EntityData<TagEntity>, 'name'>) {
    const tagEntityReference = this.tagRepository.getReference(id);

    wrap(tagEntityReference).assign(data);

    await this.tagRepository.flush();
  }

  public getEventStream(filters?: {
    deviceIds?: Array<string>;
    eventTypes?: Array<string>;
  }) {
    return this.tagsEventBus.toObservable(filters);
  }

  @UseRequestContext()
  public async onPositionMessage(
    id: string,
    position: [number, number, number],
  ) {
    const tagEntityReference = this.tagRepository.getReference(id);

    const positionEntity = new PositionEntity(tagEntityReference, position);

    await this.orm.em.persistAndFlush(positionEntity);

    this.tagsEventBus.emit('position', id, { position });
  }
}
