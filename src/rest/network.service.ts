import { Injectable } from '@nestjs/common';

import { TagEventBus } from '../eventBus/tag.eventBus';

@Injectable()
export class RestNetworkService {
  constructor(private readonly tagEventBus: TagEventBus) {}

  public getTagEventStream() {
    return this.tagEventBus.toObservable();
  }
}
