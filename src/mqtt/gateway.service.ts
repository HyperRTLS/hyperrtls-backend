import { Injectable } from '@nestjs/common';

import { DevicesEventBus, DevicePingData } from 'src/eventBus/devices.eventBus';

@Injectable()
export class MqttGatewayService {
  constructor(private readonly devicesEventBus: DevicesEventBus) {}

  public pushPingEvent(gatewayId: string, eventData: DevicePingData) {
    this.devicesEventBus.emit('ping', 'gateway', gatewayId, eventData);
  }
}
