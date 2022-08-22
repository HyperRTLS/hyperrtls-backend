import { CLIENT_PROPERTY_DECORATOR } from '../mqtt.constants';

/**
 * Injects MqttClient instance as a class property.
 *
 * Example:
 * ```typescript
 * ‌@MqttGateway()
 * class Service {
 *  ‌@MqttClientInstance() client: MqttClient;
 * }
 * ```
 */
export function MqttClientInstance(): PropertyDecorator {
  return (target: object, propertyKey: string | symbol) => {
    Reflect.set(target, propertyKey, null);
    Reflect.defineMetadata(
      CLIENT_PROPERTY_DECORATOR,
      true,
      target,
      propertyKey,
    );
  };
}
