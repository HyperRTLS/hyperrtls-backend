import { Entity, OneToMany, Collection } from '@mikro-orm/core';

import { BaseDeviceEntity } from '../base/base.entity';

import { PositionEntity } from './position.entity';

@Entity({ tableName: 'tag' })
export class TagEntity extends BaseDeviceEntity {
  constructor(id: string, name: string) {
    super(id, name);
  }

  @OneToMany({
    entity: () => PositionEntity,
    mappedBy: 'tag',
    orphanRemoval: true,
  })
  positions = new Collection<PositionEntity>(this);
}
