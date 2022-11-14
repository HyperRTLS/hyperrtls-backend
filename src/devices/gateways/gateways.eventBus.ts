import { Injectable } from '@nestjs/common';

import { BaseDevicesEventBus } from '../base/base.eventBus';

@Injectable()
export class GatewaysEventBus extends BaseDevicesEventBus {
  constructor() {
    super('gateway');
  }

  public emit(
    eventType: string,
    deviceId: string,
    eventData: Record<string, unknown>,
  ): void {
    super.emit(eventType, deviceId, eventData);
  }
}
