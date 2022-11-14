import { Injectable } from '@nestjs/common';

import { BaseDevicesEventBus } from '../base/base.eventBus';

export type PositionEventData = {
  position: [number, number, number];
};

@Injectable()
export class TagsEventBus extends BaseDevicesEventBus {
  constructor() {
    super('tag');
  }

  public emit(
    eventType: 'position',
    deviceId: string,
    eventData: PositionEventData,
  ): void;
  public emit(
    eventType: string,
    deviceId: string,
    eventData: Record<string, unknown>,
  ): void {
    super.emit(eventType, deviceId, eventData);
  }
}
