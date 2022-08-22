import { Controller, Get } from '@nestjs/common';

import { RestDynamicSecurityService } from './dynsec.service';

@Controller('/dynsec')
export class RestDynamicSecurityController {
  constructor(private readonly dynsecService: RestDynamicSecurityService) {}

  @Get()
  getInfo() {
    return this.dynsecService.getInfo();
  }
}
