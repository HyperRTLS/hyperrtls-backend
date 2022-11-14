import { Entity } from '@mikro-orm/core';

import { BaseDeviceEntity } from '../base/base.entity';

@Entity({ tableName: 'anchor' })
export class AnchorEntity extends BaseDeviceEntity {
  constructor(id: string, name: string) {
    super(id, name);
  }
}
