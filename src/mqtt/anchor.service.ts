import { Injectable } from '@nestjs/common';

import { DevicesEventBus, DevicePingData } from 'src/eventBus/devices.eventBus';

@Injectable()
export class MqttAnchorService {
  constructor(private readonly devicesEventBus: DevicesEventBus) {}

  public pushPingEvent(anchorId: string, eventData: DevicePingData) {
    this.devicesEventBus.emit('ping', 'anchor', anchorId, eventData);
  }
}
