import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { EnvironmentVariables, validateConfig } from './config.validator';

import { DynamicSecurityModule } from './nestjs-dynsec/dynsec.module';

import { MqttGatewayModule } from './nestjs-mqtt';

import { NodeEventBus } from './eventBus/node.eventBus';

import { RestSystemController } from './rest/system.controller';
import { RestSystemService } from './rest/system.service';
import { RestDynamicSecurityController } from './rest/dynsec.controller';
import { RestDynamicSecurityService } from './rest/dynsec.service';
import { RestGatewayController } from './rest/gateway.controller';
import { RestGatewayService } from './rest/gateway.service';
import { RestNodeController } from './rest/node.controller';
import { RestNodeService } from './rest/node.service';

import { MqttGatewayController } from './mqtt/gateway.controller';
import { MqttGatewayService } from './mqtt/gateway.service';
import { MqttNodeController } from './mqtt/node.controller';
import { MqttNodeService } from './mqtt/node.service';

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
    RestSystemController,
    RestDynamicSecurityController,
    RestGatewayController,
    RestNodeController,
  ],
  providers: [
    // Event bus
    NodeEventBus,

    // REST services
    RestSystemService,
    RestDynamicSecurityService,
    RestGatewayService,
    RestNodeService,

    // MQTT controllers
    MqttGatewayController,
    MqttNodeController,

    // MQTT services
    MqttGatewayService,
    MqttNodeService,
  ],
})
export class AppModule {}
