import { Injectable } from '@nestjs/common';

import { BaseDevicesEventBus } from '../base/base.eventBus';

@Injectable()
export class AnchorsEventBus extends BaseDevicesEventBus {
  constructor() {
    super('anchor');
  }

  public emit(
    eventType: string,
    deviceId: string,
    eventData: Record<string, unknown>,
  ): void {
    super.emit(eventType, deviceId, eventData);
  }
}
