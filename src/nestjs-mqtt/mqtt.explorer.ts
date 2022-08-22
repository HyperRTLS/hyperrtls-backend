import { Injectable } from '@nestjs/common';
import { MetadataScanner, ModulesContainer } from '@nestjs/core';

import { ComponentType, DiscoveredComponent, Explorer } from './utils';

import {
  GATEWAY_CLASS_DECORATOR,
  CLIENT_PROPERTY_DECORATOR,
  SUBSCRIBE_METHOD_DECORATOR,
} from './mqtt.constants';

@Injectable()
export class MqttExplorer extends Explorer {
  constructor(
    modulesContainer: ModulesContainer,
    metadataScanner: MetadataScanner,
  ) {
    super(modulesContainer, metadataScanner);
  }

  discoverGateways(includeControllers = false) {
    const types = [ComponentType.PROVIDER];
    if (includeControllers) types.push(ComponentType.CONTROLLER);

    return this.discoverModulesComponentsWithMeta(
      types,
      GATEWAY_CLASS_DECORATOR,
    );
  }

  discoverClientInjections(gateways: DiscoveredComponent[]) {
    return this.discoverComponentsPropertiesWithMeta(
      gateways,
      CLIENT_PROPERTY_DECORATOR,
    );
  }

  discoverSubscribers(gateways: DiscoveredComponent[]) {
    return this.discoverComponentsMethodsWithMeta(
      gateways,
      SUBSCRIBE_METHOD_DECORATOR,
    );
  }
}
