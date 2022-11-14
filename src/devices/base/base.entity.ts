import { PrimaryKey, Property, Check } from '@mikro-orm/core';

export abstract class BaseDeviceEntity {
  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }

  @PrimaryKey({ autoincrement: false })
  @Check({ expression: 'LENGTH(id) <= 16' })
  id!: string;

  @Property()
  name!: string;

  @Property()
  createdAt?: Date = new Date();
}
