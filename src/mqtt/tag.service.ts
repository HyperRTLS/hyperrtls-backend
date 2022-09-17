import { Injectable } from '@nestjs/common';

import {
  DevicesEventBus,
  DevicePingData,
  TagLocationData,
} from '../eventBus/devices.eventBus';

@Injectable()
export class MqttTagService {
  constructor(private readonly devicesEventBus: DevicesEventBus) {}

  public pushPingEvent(tagId: string, eventData: DevicePingData) {
    this.devicesEventBus.emit('ping', 'tag', tagId, eventData);
  }

  public pushLocationEvent(tagId: string, eventData: TagLocationData) {
    this.devicesEventBus.emit('location', 'tag', tagId, eventData);
  }
}
