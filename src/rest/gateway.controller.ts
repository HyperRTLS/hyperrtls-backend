import { Controller } from '@nestjs/common';

import { RestGatewayService } from './gateway.service';

@Controller()
export class RestGatewayController {
  constructor(private readonly restGatewayService: RestGatewayService) {}
}
