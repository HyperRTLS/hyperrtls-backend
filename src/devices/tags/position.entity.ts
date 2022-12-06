import { Entity, Property, PrimaryKey, ManyToOne } from '@mikro-orm/core';

import { TagEntity } from './tag.entity';

@Entity({ tableName: 'tag-position' })
export class PositionEntity {
  constructor(tag: TagEntity, position: [number, number, number]) {
    const [x, y, z] = position;

    this.tag = tag;
    this.x = x;
    this.y = y;
    this.z = z;
  }

  @PrimaryKey()
  id!: number;

  @ManyToOne({ entity: () => TagEntity, hidden: true })
  tag!: TagEntity;

  @Property({ columnType: 'float', hidden: true })
  x!: number;

  @Property({ columnType: 'float', hidden: true })
  y!: number;

  @Property({ columnType: 'float', hidden: true })
  z!: number;

  @Property()
  createdAt?: Date = new Date();

  @Property({ persist: false })
  get position() {
    return [this.x, this.y, this.z];
  }
}
