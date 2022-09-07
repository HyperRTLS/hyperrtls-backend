import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { EnvironmentVariables, validateConfig } from './config.validator';

import { DynamicSecurityModule } from './nestjs-dynsec/dynsec.module';

import { MqttGatewayModule } from './nestjs-mqtt';

import { TagEventBus } from './eventBus/tag.eventBus';

import { RestNetworkController } from './rest/network.controller';
import { RestNetworkService } from './rest/network.service';

import { MqttGatewayController } from './mqtt/gateway.controller';
import { MqttGatewayService } from './mqtt/gateway.service';
import { MqttTagController } from './mqtt/tag.controller';
import { MqttTagService } from './mqtt/tag.service';

const env = process.env.NODE_ENV || 'development';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${env}`,
      validate: validateConfig,
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
  ],
  controllers: [
    // REST controllers
    RestNetworkController,
  ],
  providers: [
    // Event bus
    TagEventBus,

    // REST services
    RestNetworkService,

    // MQTT controllers
    MqttGatewayController,
    MqttTagController,

    // MQTT services
    MqttGatewayService,
    MqttTagService,
  ],
})
export class AppModule {}
