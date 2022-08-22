import { Injectable } from '@nestjs/common';

import { NodeEventBus, NodeLocationEvent } from '../eventBus/node.eventBus';

@Injectable()
export class MqttNodeService {
  constructor(private readonly nodeEventBus: NodeEventBus) {}

  public pushLocationEvent(eventData: NodeLocationEvent) {
    this.nodeEventBus.emit('location', eventData);
  }
}
