import {
  ArgumentMetadata,
  Paramtype,
  PipeTransform,
  Type,
} from '@nestjs/common';
import { ClassTransformOptions, plainToClass } from '@nestjs/class-transformer';
import {
  validate,
  ValidationError,
  ValidatorOptions,
} from '@nestjs/class-validator';

export interface MqttValidationPipeOptions {
  validatorOptions?: ValidatorOptions;
  transformOptions?: ClassTransformOptions;
  exceptionFactory?: (errors: ValidationError[]) => any;
}

export class MqttValidationPipe implements PipeTransform<any> {
  private readonly validatorOptions?: ValidatorOptions;
  private readonly transformOptions?: ClassTransformOptions;
  private readonly exceptionFactory: (errors: ValidationError[]) => any;

  constructor(readonly options: MqttValidationPipeOptions = {}) {
    const { validatorOptions, transformOptions, exceptionFactory } = options;

    this.validatorOptions = validatorOptions;
    this.transformOptions = transformOptions;
    this.exceptionFactory = exceptionFactory || this.createExceptionFactory();
  }

  public async transform(value: unknown, metadata: ArgumentMetadata) {
    const { type, metatype } = metadata;

    // According to NestJS documentation, the metatype is undefined if you either
    // omit a type declaration in the route handler method signature, or use vanilla JavaScript
    // See https://docs.nestjs.com/pipes#custom-pipes
    if (!metatype) {
      return value;
    }

    // Process only @Payload decorator
    if (!this.isPayload(value, type)) {
      return value;
    }

    if (metatype === Buffer) {
      return value;
    }

    if (this.isMetatypePrimitive(metatype)) {
      return this.transformPrimitive(value, metatype);
    }

    const toTransform = this.tryParseJSON(value);
    const transformed = plainToClass(
      metatype,
      toTransform,
      this.transformOptions,
    );

    let toValidate = transformed;

    // If there is a constructor mismatch, we follow two routes:
    // 1. If the transformed value is a primitive, create new object with injected constructor
    // 2. If the transformed value is not a primitive, simply replace the constructor
    // This is to ensure we valdiate against valid class
    if (transformed.constructor !== metatype) {
      if (this.isValuePrimitive(transformed)) {
        toValidate = { constructor: metatype };
      } else {
        toValidate.constructor = metatype;
      }
    }

    const validationErrors = await validate(toValidate, this.validatorOptions);
    if (validationErrors.length > 0) {
      throw await this.exceptionFactory(validationErrors);
    }

    return transformed;
  }

  private createExceptionFactory() {
    return (validationErrors: ValidationError[] = []) => {
      // TODO
      console.log(validationErrors);
      return new Error();
    };
  }

  private tryParseJSON(value: Buffer): object | string {
    const str = value.toString();

    try {
      return JSON.parse(str);
    } catch (error) {
      return str;
    }
  }

  private isValuePrimitive(value: any) {
    return ['boolean', 'number', 'bigint', 'string'].includes(typeof value);
  }

  private isMetatypePrimitive(metatype: Type<any>) {
    return [Boolean, Number, BigInt, String].includes(metatype as any);
  }

  private transformPrimitive(value: Buffer, metatype: Type<any>) {
    switch (metatype) {
      case Boolean:
        return value.toString() === 'true';
      case Number:
        return +value.toString();
      case BigInt as any:
        return BigInt(value.toString());
      case String:
        return value.toString();
    }
  }

  private isPayload(value: unknown, type: Paramtype): value is Buffer {
    return type === 'body';
  }
}
