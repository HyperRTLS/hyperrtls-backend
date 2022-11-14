import { Controller, UsePipes, ValidationPipe } from '@nestjs/common';

import { GatewaysService } from './gateways.service';

@Controller('devices/gateways')
@UsePipes(
  new ValidationPipe({
    transform: true,
    whitelist: true,
  }),
)
export class GatewaysRestController {
  constructor(private readonly gatewaysService: GatewaysService) {}
}
