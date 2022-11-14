import { Entity } from '@mikro-orm/core';

import { BaseDeviceEntity } from '../base/base.entity';

@Entity({ tableName: 'gateway' })
export class GatewayEntity extends BaseDeviceEntity {
  constructor(id: string, name: string) {
    super(id, name);
  }
}
