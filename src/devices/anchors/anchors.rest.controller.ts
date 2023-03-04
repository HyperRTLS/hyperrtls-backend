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

import {
  IsOptional,
  IsString,
  MaxLength,
  IsArray,
  IsNumber,
} from 'class-validator';

import { Type, Transform } from 'class-transformer';

import { AnchorsService } from './anchors.service';

export class GetAnchorsFiltersQuery {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Type(() => String)
  @Transform(({ value }) => value.split(','))
  id?: string[];
}

export class GetAnchorsOptionsQuery {}

export class CreateAnchorDto {
  @IsString()
  @MaxLength(16)
  id: string;

  @IsString()
  name: string;

  @IsNumber({}, { each: true })
  position: [number, number, number];
}

export class GetAnchorOptionsQuery {}

export class GetAnchorsEventsFiltersQuery {
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

export class GetAnchorEventsFiltersQuery {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Type(() => String)
  @Transform(({ value }) => value.split(','))
  eventTypes?: string[];
}

@Controller('devices/Anchors')
@UsePipes(
  new ValidationPipe({
    transform: true,
    whitelist: true,
  }),
)
export class AnchorsRestController {
  constructor(private readonly anchorsService: AnchorsService) {}

  @Get()
  getAll(
    @Query() filters: GetAnchorsFiltersQuery,
    @Query() options: GetAnchorsOptionsQuery,
  ) {
    return this.anchorsService.get({ ...filters }, options);
  }

  @Post()
  create(@Body() payload: CreateAnchorDto) {
    const { id, name, position } = payload;

    return this.anchorsService.create({ id, name, position });
  }

  @Sse('_events')
  subscribeToEvents(@Query() filters: GetAnchorsEventsFiltersQuery) {
    return this.anchorsService.getEventStream(filters);
  }

  @Get(':id')
  getOneById(@Param('id') id: string, @Query() options: GetAnchorOptionsQuery) {
    return this.anchorsService.getOneById(id, options);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.anchorsService.deleteById(id);
  }

  @Get(':id/_events')
  subscribeToDeviceEvents(
    @Param('id') deviceId: string,
    @Query() filters: GetAnchorEventsFiltersQuery,
  ) {
    return this.anchorsService.getEventStream({
      deviceIds: [deviceId],
      ...filters,
    });
  }
}
