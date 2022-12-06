import {
  Body,
  Controller,
  Get,
  Post,
  Sse,
  Param,
  UsePipes,
  ValidationPipe,
  Query,
  Delete,
} from '@nestjs/common';

import { IsOptional, IsString, MaxLength, IsArray } from 'class-validator';

import { Type, Transform } from 'class-transformer';

import { GatewaysService } from './gateways.service';

export class GetGatewaysFiltersQuery {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Type(() => String)
  @Transform(({ value }) => value.split(','))
  id?: string[];
}

export class GetGatewaysOptionsQuery {}

export class CreateGatewayDto {
  @IsString()
  @MaxLength(16)
  id: string;

  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  mqttPassword?: string;
}

export class GetGatewayOptionsQuery {}

export class GetGatewaysEventsFiltersQuery {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Type(() => String)
  @Transform(({ value }) => value.split(','))
  deviceIds?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Type(() => String)
  @Transform(({ value }) => value.split(','))
  eventTypes?: string[];
}

export class GetGatewayEventsFiltersQuery {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Type(() => String)
  @Transform(({ value }) => value.split(','))
  eventTypes?: string[];
}

@Controller('devices/gateways')
@UsePipes(
  new ValidationPipe({
    transform: true,
    whitelist: true,
  }),
)
export class GatewaysRestController {
  constructor(private readonly gatewaysService: GatewaysService) {}

  @Get()
  getAll(
    @Query() filters: GetGatewaysFiltersQuery,
    @Query() options: GetGatewaysOptionsQuery,
  ) {
    return this.gatewaysService.get({ ...filters }, options);
  }

  @Post()
  create(@Body() payload: CreateGatewayDto) {
    const { id, name, mqttPassword } = payload;

    return this.gatewaysService.create({ id, name, mqttPassword });
  }

  @Sse('_events')
  subscribeToEvents(@Query() filters: GetGatewaysEventsFiltersQuery) {
    return this.gatewaysService.getEventStream(filters);
  }

  @Get(':id')
  getOneById(
    @Param('id') id: string,
    @Query() options: GetGatewayOptionsQuery,
  ) {
    return this.gatewaysService.getOneById(id, options);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.gatewaysService.deleteById(id);
  }

  @Get(':id/_events')
  subscribeToDeviceEvents(
    @Param('id') deviceId: string,
    @Query() filters: GetGatewayEventsFiltersQuery,
  ) {
    return this.gatewaysService.getEventStream({
      deviceIds: [deviceId],
      ...filters,
    });
  }
}
