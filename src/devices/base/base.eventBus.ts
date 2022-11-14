import { Subject, filter, identity } from 'rxjs';

export type BaseEventData = {
  deviceType: string;
  deviceId: string;

  [key: string]: unknown;
};

function deviceIdsFilterFactory(deviceIds: Array<string>) {
  return filter<MessageEvent<BaseEventData>>((event) =>
    deviceIds.includes(event.data.deviceId),
  );
}

function eventTypesFilterFactory(eventTypes: Array<string>) {
  return filter<MessageEvent<BaseEventData>>((event) =>
    eventTypes.includes(event.type),
  );
}

export abstract class BaseDevicesEventBus {
  constructor(private readonly deviceType: string) {}

  private readonly subject = new Subject<MessageEvent<BaseEventData>>();

  public emit(
    eventType: string,
    deviceId: string,
    eventData: Record<string, unknown>,
  ): void {
    this.subject.next(
      new MessageEvent(eventType, {
        data: {
          ...eventData,
          deviceType: this.deviceType,
          deviceId,
        },
      }),
    );
  }

  public toObservable(
    filters: {
      deviceIds?: Array<string>;
      eventTypes?: Array<string>;
    } = {},
  ) {
    const { deviceIds, eventTypes } = filters;

    return this.subject
      .asObservable()
      .pipe(
        deviceIds ? deviceIdsFilterFactory(deviceIds) : identity,
        eventTypes ? eventTypesFilterFactory(eventTypes) : identity,
      );
  }
}
