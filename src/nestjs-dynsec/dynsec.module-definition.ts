import { IClientOptions } from 'mqtt';

import { ConfigurableModuleBuilder } from '@nestjs/common';

export interface DynamicSecurityModuleConfig {
  brokerUrl: string;
  clientConfig?: IClientOptions;
}

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<DynamicSecurityModuleConfig>().build();
