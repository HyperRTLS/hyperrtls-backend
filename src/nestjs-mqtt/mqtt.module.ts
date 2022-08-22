import {
  Global,
  Module,
  Logger,
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from '@nestjs/common';
import { DiscoveryModule, DiscoveryService } from '@nestjs/core';

import { ConfigurableModuleClass } from './mqtt.module-definition';

import { MqttExplorer } from './mqtt.explorer';
import { MqttSubscriberParamsFactory } from './mqtt.factory';
import { MqttController } from './mqtt.controller';

@Global()
@Module({
  imports: [DiscoveryModule],
  providers: [
    DiscoveryService,
    MqttExplorer,
    MqttSubscriberParamsFactory,
    MqttController,
  ],
})
export class MqttGatewayModule
  extends ConfigurableModuleClass
  implements OnApplicationBootstrap, OnApplicationShutdown
{
  private readonly logger = new Logger(MqttGatewayModule.name);

  constructor(private readonly controller: MqttController) {
    super();
  }

  onApplicationBootstrap() {
    this.logger.log('Initializing module...');

    this.controller.init();

    this.logger.log('Module successfully initialized');
  }

  onApplicationShutdown() {
    this.logger.log('Closing MQTT connection...');
    // TODO: Gracefully disconnect client
    this.logger.log('MQTT connection successfully closed');
  }
}
