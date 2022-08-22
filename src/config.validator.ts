import { plainToClass } from '@nestjs/class-transformer';

import { validateSync, IsString } from '@nestjs/class-validator';

export class EnvironmentVariables {
  @IsString()
  DYNSEC_BROKER_URL: string;

  @IsString()
  DYNSEC_BROKER_USERNAME: string;

  @IsString()
  DYNSEC_BROKER_PASSWORD: string;

  @IsString()
  MQTT_BROKER_URL: string;

  @IsString()
  MQTT_BROKER_USERNAME: string;

  @IsString()
  MQTT_BROKER_PASSWORD: string;

  @IsString()
  DATABASE_URL: string;
}

export function validateConfig(config: Record<string, unknown>) {
  const transformedConfig = plainToClass(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(transformedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return transformedConfig;
}
