import { Injectable } from '@nestjs/common';

import { filter } from 'rxjs';

import { DevicesEventBus } from '../eventBus/devices.eventBus';

@Injectable()
export class RestNetworkService {
  constructor(private readonly devicesEventBus: DevicesEventBus) {}

  public getDevicesData(filters: {
    deviceTypes?: Array<'tag' | 'anchor' | 'gateway'>;
    deviceIds?: Array<string>;
  }) {
    const { deviceTypes, deviceIds } = filters;

    // TODO: Fetch from database
    const devices = [
      {
        deviceType: 'tag',
        deviceName: 'Keychain #1',
        deviceId: 'keychain-1',
        lastSeen: new Date().getTime(),
        location: [1, 1, 1],
      },
      {
        deviceType: 'tag',
        deviceName: 'Keychain #2',
        deviceId: 'keychain-2',
        lastSeen: new Date().getTime(),
        location: [-1, 1, -1],
      },
      {
        deviceType: 'tag',
        deviceName: 'Keychain #3',
        deviceId: 'keychain-3',
        lastSeen: new Date().getTime(),
        location: [-1, 1, 1],
      },
      {
        deviceType: 'anchor',
        deviceName: 'Anchor #1',
        deviceId: 'anchor-1',
        lastSeen: new Date().getTime(),
      },
      {
        deviceType: 'anchor',
        deviceName: 'Anchor #2',
        deviceId: 'anchor-2',
        lastSeen: new Date().getTime(),
      },
      {
        deviceType: 'anchor',
        deviceName: 'Anchor #3',
        deviceId: 'anchor-3',
        lastSeen: new Date().getTime(),
      },
      {
        deviceType: 'gateway',
        deviceName: 'Main Gateway',
        deviceId: 'gateway',
        lastSeen: new Date().getTime(),
      },
    ] as Array<{
      deviceType: 'tag' | 'anchor' | 'gateway';
      deviceName: string;
      deviceId: string;
      lastSeen: number;
      location?: [number, number, number];
    }>;

    return devices.filter((device) => {
      if (deviceTypes && !deviceTypes.includes(device.deviceType)) return false;
      if (deviceIds && !deviceIds.includes(device.deviceId)) return false;

      return true;
    });
  }

  public getEventStream(filters: {
    deviceTypes?: Array<'tag' | 'anchor' | 'gateway'>;
    deviceIds?: Array<string>;
    eventTypes?: Array<string>;
  }) {
    const { deviceTypes, eventTypes, deviceIds } = filters;

    return this.devicesEventBus.toObservable().pipe(
      filter((event) => {
        if (deviceTypes && !deviceTypes.includes(event.data.deviceType))
          return false;
        if (deviceIds && !deviceIds.includes(event.data.deviceId)) return false;
        if (eventTypes && !eventTypes.includes(event.type)) return false;

        return true;
      }),
    );
  }
}
