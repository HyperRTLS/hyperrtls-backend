import { Injectable } from '@nestjs/common';

import { Subject } from 'rxjs';

export interface NodeLocationEvent {
  nodeId: string;
  x: number;
  y: number;
  z: number;
}

@Injectable()
export class NodeEventBus {
  private readonly subject = new Subject<MessageEvent>();

  public emit(eventType: 'location', eventData: NodeLocationEvent): void;
  public emit(eventType: string, eventData: unknown): void {
    this.subject.next(new MessageEvent(eventType, { data: eventData }));
  }

  public toObservable() {
    return this.subject.asObservable();
  }
}
