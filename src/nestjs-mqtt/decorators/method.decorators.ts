import { validatePattern } from '../utils';

import {
  SUBSCRIBE_METHOD_DECORATOR,
  SUBSCRIBE_METHOD_DECORATOR_PARAM,
} from '../mqtt.constants';

/**
 * MQTT subcribe method decorator. Declares method as a subscriber for incoming messages on a specified topic. It is prepended by gateway's topic if present.
 *
 * Example:
 * ```typescript
 * ‌@Subscribe()
 * function onMessage() {}
 * ```
 *
 * @param {string} topic name of a topic to subscribe to
 */
export function MqttSubscribe(topic: string): MethodDecorator {
  return (
    _target: object,
    _key: string | symbol,
    descriptor: PropertyDescriptor,
  ) => {
    if (!validatePattern(topic)) {
      throw new Error(`Invalid topic pattern: ${topic}`);
    }

    Reflect.defineMetadata(SUBSCRIBE_METHOD_DECORATOR, true, descriptor.value);
    Reflect.defineMetadata(
      SUBSCRIBE_METHOD_DECORATOR_PARAM,
      topic,
      descriptor.value,
    );
  };
}
