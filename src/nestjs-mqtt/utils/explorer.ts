import { Scope } from '@nestjs/common';
import { MetadataScanner, ModulesContainer } from '@nestjs/core';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import { Module } from '@nestjs/core/injector/module';

import iterate from 'iterare';

export enum ComponentType {
  PROVIDER = 'providers',
  CONTROLLER = 'controllers',
}

export interface DiscoveredBase {
  name: string;
  prettyName: string;
}

export interface DiscoveredComponent extends DiscoveredBase {
  parentModule: Module;
  instanceWrapper: InstanceWrapper;
}

export interface DiscoveredComponentMethod extends DiscoveredBase {
  parentComponent: DiscoveredComponent;
  callback: () => void;
}

export interface DiscoveredComponentProperty extends DiscoveredBase {
  parentComponent: DiscoveredComponent;
}

export class Explorer {
  constructor(
    private readonly modulesContainer: ModulesContainer,
    private readonly metadataScanner: MetadataScanner,
  ) {}

  discoverModuleComponentsWithMeta(
    module: Module,
    types: ComponentType[],
    metaKey: string,
  ): DiscoveredComponent[] {
    return iterate(types)
      .map((componentType) => module[componentType].values())
      .flatten()
      .filter((wrapper) => wrapper.scope !== Scope.REQUEST)
      .filter((wrapper) => !wrapper.isNotMetatype)
      .filter(({ metatype }) => Reflect.getMetadata(metaKey, metatype))
      .map((wrapper) => ({
        name: wrapper.name,
        prettyName: `${module.metatype.name}.${wrapper.name}`,
        parentModule: module,
        instanceWrapper: wrapper,
      }))
      .toArray();
  }

  discoverModulesComponentsWithMeta(
    types: ComponentType[],
    metaKey: string,
  ): DiscoveredComponent[] {
    return iterate(this.modulesContainer.values())
      .map((module) =>
        this.discoverModuleComponentsWithMeta(module, types, metaKey),
      )
      .flatten()
      .toArray();
  }

  discoverComponentMethodsWithMeta(
    component: DiscoveredComponent,
    metaKey: string,
  ): DiscoveredComponentMethod[] {
    const instance = component.instanceWrapper.instance;

    if (!instance) {
      return [];
    }

    const instancePrototype = Object.getPrototypeOf(instance);

    const methodNames =
      this.metadataScanner.getAllFilteredMethodNames(instancePrototype);

    return iterate(methodNames)
      .filter((methodName) =>
        Reflect.getMetadata(metaKey, instance[methodName]),
      )
      .map((methodName) => ({
        name: methodName,
        prettyName: `${component.prettyName}.${methodName}`,
        parentComponent: component,
        callback: instance[methodName],
      }))
      .toArray();
  }

  discoverComponentsMethodsWithMeta(
    components: DiscoveredComponent[],
    metaKey: string,
  ): DiscoveredComponentMethod[] {
    return iterate(components)
      .map((component) =>
        this.discoverComponentMethodsWithMeta(component, metaKey),
      )
      .flatten()
      .toArray();
  }

  discoverComponentPropertiesWithMeta(
    component: DiscoveredComponent,
    metaKey: string,
  ): DiscoveredComponentProperty[] {
    const instance = component.instanceWrapper.instance;

    if (!instance) {
      return [];
    }

    const instancePrototype = Object.getPrototypeOf(instance);

    return iterate(Object.getOwnPropertyNames(instancePrototype))
      .filter((propertyKey) =>
        Reflect.getMetadata(metaKey, instance, propertyKey),
      )
      .map((propertyKey) => ({
        name: propertyKey,
        prettyName: `${component.prettyName}.${propertyKey}`,
        parentComponent: component,
      }))
      .toArray();
  }

  discoverComponentsPropertiesWithMeta(
    components: DiscoveredComponent[],
    metaKey: string,
  ): DiscoveredComponentProperty[] {
    return iterate(components)
      .map((component) =>
        this.discoverComponentPropertiesWithMeta(component, metaKey),
      )
      .flatten()
      .toArray();
  }
}
