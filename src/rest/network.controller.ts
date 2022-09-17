import { Controller, Get, ParseArrayPipe, Query, Sse } from '@nestjs/common';

import { RestNetworkService } from './network.service';

const parseArrayPipe = new ParseArrayPipe({
  separator: ',',
  optional: true,
});

@Controller('network')
export class RestNetworkController {
  constructor(private readonly restNetworkService: RestNetworkService) {}

  @Get('devices')
  getDevicesData(
    @Query('deviceTypes', parseArrayPipe)
    deviceTypes?: Array<'tag' | 'anchor' | 'gateway'>,
    @Query('deviceIds', parseArrayPipe)
    deviceIds?: Array<string>,
  ) {
    return this.restNetworkService.getDevicesData({
      deviceTypes,
      deviceIds,
    });
  }

  @Sse('events')
  subscribeToDevicesEvents(
    @Query('deviceTypes', parseArrayPipe)
    deviceTypes?: Array<'tag' | 'anchor' | 'gateway'>,
    @Query('deviceIds', parseArrayPipe)
    deviceIds?: Array<string>,
    @Query('eventTypes', parseArrayPipe)
    eventTypes?: Array<string>,
  ) {
    return this.restNetworkService.getEventStream({
      deviceTypes,
      deviceIds,
      eventTypes,
    });
  }
}
