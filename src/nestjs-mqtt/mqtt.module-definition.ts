import { IClientOptions } from 'mqtt';

import { ConfigurableModuleBuilder } from '@nestjs/common';

import { GATEWAY_MODULE_CONFIG } from './mqtt.constants';

export interface MqttGatewayModuleConfig {
  brokerUrl: string;
  clientConfig?: IClientOptions;
  discoverControllers?: boolean;
  suppressRoutesErrors?: boolean;
  enableFilters?: boolean;
  enableGuards?: boolean;
  enableInterceptors?: boolean;
}

export const { ConfigurableModuleClass } =
  new ConfigurableModuleBuilder<MqttGatewayModuleConfig>({
    optionsInjectionToken: GATEWAY_MODULE_CONFIG,
  }).build();
