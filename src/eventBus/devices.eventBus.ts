import { Injectable } from '@nestjs/common';

import { Subject } from 'rxjs';

export type DeviceType = 'tag' | 'anchor' | 'gateway';

export type DevicePingData = {
  timestamp: number;
};

export type TagLocationData = {
  x: number;
  y: number;
  z: number;
};

export type BaseMessageEventData = {
  deviceType: DeviceType;
  deviceId: string;
};

@Injectable()
export class DevicesEventBus {
  private readonly subject = new Subject<MessageEvent<BaseMessageEventData>>();

  public emit(
    eventType: 'location',
    deviceType: 'tag',
    deviceId: string,
    eventData: TagLocationData,
  ): void;
  public emit(
    eventType: 'ping',
    deviceType: DeviceType,
    deviceId: string,
    eventData: DevicePingData,
  ): void;
  public emit(
    eventType: string,
    deviceType: DeviceType,
    deviceId: string,
    eventData: Record<string, unknown>,
  ): void {
    this.subject.next(
      new MessageEvent(eventType, {
        data: {
          ...eventData,
          deviceType,
          deviceId,
        },
      }),
    );
  }

  public toObservable() {
    return this.subject.asObservable();
  }
}
