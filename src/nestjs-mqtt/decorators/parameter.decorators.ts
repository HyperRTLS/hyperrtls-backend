import { Type, PipeTransform, assignMetadata, ParamData } from '@nestjs/common';

import { SUBSCRIBE_METHOD_PARAM_DECORATOR } from '../mqtt.constants';

/**
 * Defines parameter decorators types. NestJS uses those values to determine the *Paramtype* (3 = body, 4 = query, 5 = param).
 * Other values are considered as custom decorators.
 */
export enum SubscriberParamType {
  CLIENT = 0,
  TOPIC = 5,
  PAYLOAD = 3,
  PACKET = 1,
}

/**
 * Creates a parameter decorator of a specified type. The created decorator accepts arbitrary data value.
 *
 * @param {SubscriberParamType} paramType parameter type
 * @returns {ParameterDecorator} ParameterDecorator
 */
function createSubscriberParamDecorator(paramType: SubscriberParamType) {
  return (data?: ParamData): ParameterDecorator => {
    return (target, key, index) => {
      const args =
        Reflect.getMetadata(
          SUBSCRIBE_METHOD_PARAM_DECORATOR,
          target.constructor,
          key,
        ) || {};

      Reflect.defineMetadata(
        SUBSCRIBE_METHOD_PARAM_DECORATOR,
        assignMetadata(args, paramType, index, data),
        target.constructor,
        key,
      );
    };
  };
}

/**
 * Creates a parameter decorator of a specified type. The created decorator accepts pipes.
 *
 * @param {SubscriberParamType} paramType parameter type
 * @returns {ParameterDecorator} ParameterDecorator
 */
function createPipesSubscriberParamDecorator(paramType: SubscriberParamType) {
  return (
    ...pipes: (Type<PipeTransform> | PipeTransform)[]
  ): ParameterDecorator => {
    return (target, key, index) => {
      const args =
        Reflect.getMetadata(
          SUBSCRIBE_METHOD_PARAM_DECORATOR,
          target.constructor,
          key,
        ) || {};

      Reflect.defineMetadata(
        SUBSCRIBE_METHOD_PARAM_DECORATOR,
        assignMetadata(args, paramType, index, undefined, ...pipes),
        target.constructor,
        key,
      );
    };
  };
}

/**
 * MQTT client object parameter decorator.
 *
 * Example:
 * ```typescript
 * ‌@Subscribe()
 * function onMessage(@Client() client: MqttClient) {}
 * ```
 */
export const Client: () => ParameterDecorator = createSubscriberParamDecorator(
  SubscriberParamType.CLIENT,
);

/**
 * MQTT topic parameter decorator.
 *
 * Example:
 * ```typescript
 * ‌@Subscribe('devices/+/+deviceId')
 * function onMessage(
 *  ‌@Topic() topic: string,
 *  ‌@Topic(0) firstParam: string,
 *  ‌@Topic('deviceId') deviceId: string,
 * ) {}
 * ```
 *
 * @param {string|number} [key=''] identifier of a topic param to extract (string for named param, number for both named and unnamed - indexed by occuring order), returns the whole topic if not specified
 */
export const Topic: (key?: string | number) => ParameterDecorator =
  createSubscriberParamDecorator(SubscriberParamType.TOPIC);

/**
 * MQTT payload parameter decorator.
 *
 * Example:
 * ```typescript
 * ‌@Subscribe()
 * function onMessage(
 *  ‌@Payload() payload: Buffer,
 *  ‌@Payload(new ValidationPipe()) validatedPayload: PayloadDto,
 * ) {}
 * ```
 *
 * @param {(Type<PipeTransform> | PipeTransform)[]} pipes either instances or classes - to apply to the bound parameter
 */
export const Payload: (
  ...pipes: (Type<PipeTransform> | PipeTransform)[]
) => ParameterDecorator = createPipesSubscriberParamDecorator(
  SubscriberParamType.PAYLOAD,
);

/**
 * MQTT packet object parameter decorator.
 *
 * Example:
 * ```typescript
 * ‌@Subscribe()
 * function onMessage(@Packet() packet: IPacket) {}
 * ```
 */
export const Packet: () => ParameterDecorator = createSubscriberParamDecorator(
  SubscriberParamType.PACKET,
);
