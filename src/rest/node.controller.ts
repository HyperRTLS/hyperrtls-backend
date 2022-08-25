import { Controller, ParseArrayPipe, Query, Sse } from '@nestjs/common';

import { RestNodeService } from './node.service';

const parseArrayPipe = new ParseArrayPipe({
  separator: ',',
  optional: true,
});

@Controller('nodes')
export class RestNodeController {
  constructor(private readonly restNodeService: RestNodeService) {}

  @Sse('events')
  subscribe(
    @Query('eventTypes', parseArrayPipe)
    eventTypes?: Array<string>,
    @Query('nodesIds', parseArrayPipe)
    nodesIds?: Array<string>,
  ) {
    // TODO: Filter by event types and nodes ids
    console.log(eventTypes);
    console.log(nodesIds);
    return this.restNodeService.getEventStream();
  }
}
