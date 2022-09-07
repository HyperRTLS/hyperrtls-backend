import { Controller, Get, ParseArrayPipe, Query, Sse } from '@nestjs/common';

import { RestNetworkService } from './network.service';

const parseArrayPipe = new ParseArrayPipe({
  separator: ',',
  optional: true,
});

@Controller('network')
export class RestNetworkController {
  constructor(private readonly restNetworkService: RestNetworkService) {}

  @Get()
  getNetworkInfo() {
    // TODO: Fetch from database
    return {
      tags: [
        {
          name: 'Keychain #1',
          id: 'keychain-1',
          lastSeen: new Date().getTime(),
        },
        {
          name: 'Keychain #2',
          id: 'keychain-2',
          lastSeen: new Date().getTime(),
        },
        {
          name: 'Keychain #3',
          id: 'keychain-3',
          lastSeen: new Date().getTime(),
        },
      ],
      anchors: [
        { name: 'Anchor #1', id: 'anchor-1', lastSeen: new Date().getTime() },
        { name: 'Anchor #2', id: 'anchor-2', lastSeen: new Date().getTime() },
        { name: 'Anchor #3', id: 'anchor-3', lastSeen: new Date().getTime() },
      ],
      gateways: [
        {
          name: 'Main Gateway',
          id: 'gateway',
          lastSeen: new Date().getTime(),
        },
      ],
    };
  }

  @Sse('devices/tags/events')
  subscribeToTagsEvents(
    @Query('eventTypes', parseArrayPipe)
    eventTypes?: Array<string>,
    @Query('tagsIds', parseArrayPipe)
    tagsIds?: Array<string>,
  ) {
    // TODO: Filter by event types and nodes ids
    console.log(eventTypes);
    console.log(tagsIds);
    return this.restNetworkService.getTagEventStream();
  }
}
