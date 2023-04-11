import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { EnvironmentVariables, validateConfig } from './config.validator';

import { MikroORM } from '@mikro-orm/core';
import { MikroOrmModule } from '@mikro-orm/nestjs';

import { DynamicSecurityModule } from './nestjs-dynsec/dynsec.module';

import { MqttGatewayModule } from './nestjs-mqtt';

import { DevicesModule } from './devices/devices.module';

const env = process.env.NODE_ENV || 'development';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${env}`,
      validate: validateConfig,
    }),
    MikroOrmModule.forRootAsync({
      useFactory: async (
        configService: ConfigService<EnvironmentVariables, true>,
      ) => ({
        clientUrl: configService.get('DATABASE_URL'),
        type: 'postgresql',
        autoLoadEntities: true,
        debug: true,
      }),
      inject: [ConfigService],
    }),
    DynamicSecurityModule.registerAsync({
      useFactory: async (
        configService: ConfigService<EnvironmentVariables, true>,
      ) => ({
        brokerUrl: configService.get('DYNSEC_BROKER_URL'),
        clientConfig: {
          username: configService.get('DYNSEC_BROKER_USERNAME'),
          password: configService.get('DYNSEC_BROKER_PASSWORD'),
        },
      }),
      inject: [ConfigService],
    }),
    MqttGatewayModule.registerAsync({
      useFactory: async (
        configService: ConfigService<EnvironmentVariables, true>,
      ) => ({
        brokerUrl: configService.get('MQTT_BROKER_URL'),
        clientConfig: {
          username: configService.get('MQTT_BROKER_USERNAME'),
          password: configService.get('MQTT_BROKER_PASSWORD'),
        },
        discoverControllers: false,
        suppressRoutesErrors: true,
        enableFilters: false,
        enableGuards: false,
        enableInterceptors: false,
      }),
      inject: [ConfigService],
    }),
    DevicesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly orm: MikroORM) {}

  async onModuleInit() {
    await this.orm.getMigrator().up();
  }
}
