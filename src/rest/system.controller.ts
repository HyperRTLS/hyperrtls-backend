import { Controller, Get } from '@nestjs/common';

import { RestSystemService } from './system.service';

@Controller('system')
export class RestSystemController {
  constructor(private readonly restSystemService: RestSystemService) {}

  @Get('info')
  async getSystemInfo() {
    const health = await this.restSystemService.getSystemHealth();
    const info = await this.restSystemService.getSystemInfo();

    return { health, info };
  }
}
