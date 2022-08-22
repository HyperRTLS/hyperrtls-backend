import { Injectable } from '@nestjs/common';

import { NodeEventBus } from '../eventBus/node.eventBus';

@Injectable()
export class RestNodeService {
  constructor(private readonly nodeEventBus: NodeEventBus) {}

  public getEventStream() {
    return this.nodeEventBus.toObservable();
  }
}
