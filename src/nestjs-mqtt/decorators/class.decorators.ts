import { validatePattern } from '../utils';

import {
  GATEWAY_CLASS_DECORATOR,
  GATEWAY_CLASS_DECORATOR_PARAM,
} from '../mqtt.constants';

/**
 * MQTT gateway class decorator. If topic parameter is present, subsequent subscribers will listen only on topics beginning with its value.
 *
 * Example:
 * ```typescript
 * ‌@MqttGateway('gateway')
 * class Service() {
 *  ‌@Susbcribe('node')
 *  function onNodeMessage() {
 *    // I will only listen for messages on 'gateway/node' topic
 *  }
 * }
 * ```
 *
 * @param {string} [topic=''] topic prefix to apply in all subsequent subscribers
 */
export function MqttGateway(topic = ''): ClassDecorator {
  if (!validatePattern(topic)) {
    throw new Error(`Invalid topic pattern: ${topic}`);
  }

  return (target: object) => {
    Reflect.defineMetadata(GATEWAY_CLASS_DECORATOR, true, target);
    Reflect.defineMetadata(GATEWAY_CLASS_DECORATOR_PARAM, topic, target);
  };
}
