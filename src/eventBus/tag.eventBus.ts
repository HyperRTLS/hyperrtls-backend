import { Injectable } from '@nestjs/common';

import { Subject } from 'rxjs';

export interface TagLocationEvent {
  tagId: string;
  x: number;
  y: number;
  z: number;
}

@Injectable()
export class TagEventBus {
  private readonly subject = new Subject<MessageEvent>();

  public emit(eventType: 'location', eventData: TagLocationEvent): void;
  public emit(eventType: string, eventData: unknown): void {
    this.subject.next(new MessageEvent(eventType, { data: eventData }));
  }

  public toObservable() {
    return this.subject.asObservable();
  }
}
