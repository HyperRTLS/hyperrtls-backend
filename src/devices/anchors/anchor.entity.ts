import { Entity, Property } from '@mikro-orm/core';

import { BaseDeviceEntity } from '../base/base.entity';

@Entity({ tableName: 'anchor' })
export class AnchorEntity extends BaseDeviceEntity {
  constructor(id: string, name: string, position: [number, number, number]) {
    super(id, name);

    const [x, y, z] = position;
    this.x = x;
    this.y = y;
    this.z = z;
  }

  @Property({ columnType: 'float', hidden: true })
  x!: number;

  @Property({ columnType: 'float', hidden: true })
  y!: number;

  @Property({ columnType: 'float', hidden: true })
  z!: number;

  @Property({ persist: false })
  get position() {
    return [this.x, this.y, this.z];
  }
}
