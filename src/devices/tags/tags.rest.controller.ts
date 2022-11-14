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
} from '@nestjs/common';

import {
  IsOptional,
  IsString,
  MaxLength,
  IsBoolean,
  IsArray,
} from 'class-validator';

import { Type, Transform } from 'class-transformer';

import { TagsService } from './tags.service';

export class GetTagsFiltersQuery {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Type(() => String)
  @Transform(({ value }) => value.split(','))
  id?: string[];
}

export class GetTagsOptionsQuery {
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  includeAllPositions?: boolean;
}

export class CreateTagDto {
  @IsString()
  @MaxLength(16)
  id: string;

  @IsString()
  name: string;
}

export class GetTagOptionsQuery {
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  includeAllPositions?: boolean;
}

export class GetTagsEventsFiltersQuery {
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

export class GetTagEventsFiltersQuery {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Type(() => String)
  @Transform(({ value }) => value.split(','))
  eventTypes?: string[];
}
@Controller('devices/tags')
@UsePipes(
  new ValidationPipe({
    transform: true,
    whitelist: true,
  }),
)
export class TagsRestController {
  constructor(private readonly tagsService: TagsService) {}

  @Get()
  getAll(
    @Query() filters: GetTagsFiltersQuery,
    @Query() options: GetTagsOptionsQuery,
  ) {
    return this.tagsService.get({ ...filters }, options);
  }

  @Post()
  create(@Body() payload: CreateTagDto) {
    const { id, name } = payload;

    return this.tagsService.create({ id, name });
  }

  @Sse('_events')
  subscribeToEvents(@Query() filters: GetTagsEventsFiltersQuery) {
    return this.tagsService.getEventStream(filters);
  }

  @Get(':id')
  getOneById(@Param('id') id: string, @Query() options: GetTagOptionsQuery) {
    return this.tagsService.getOneById(id, options);
  }

  @Get(':id/_events')
  subscribeToDeviceEvents(
    @Param('id') deviceId: string,
    @Query() filters: GetTagEventsFiltersQuery,
  ) {
    return this.tagsService.getEventStream({
      deviceIds: [deviceId],
      ...filters,
    });
  }
}
