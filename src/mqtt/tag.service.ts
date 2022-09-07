import { Injectable } from '@nestjs/common';

import { TagEventBus, TagLocationEvent } from '../eventBus/tag.eventBus';

@Injectable()
export class MqttTagService {
  constructor(private readonly tagEventBus: TagEventBus) {}

  public pushLocationEvent(eventData: TagLocationEvent) {
    this.tagEventBus.emit('location', eventData);
  }
}
