import * as si from 'systeminformation';

import { Injectable } from '@nestjs/common';

import { DynamicSecurityService } from '../nestjs-dynsec/dynsec.service';

@Injectable()
export class RestSystemService {
  constructor(private readonly dynsecService: DynamicSecurityService) {}

  async getSystemHealth() {
    const dynsec = this.dynsecService.isConnected();
    const gateway = true; // TODO
    return { dynsec, gateway };
  }

  async getSystemInfo() {
    return si.get({
      osInfo: 'platform distro release kernel arch',
      mem: 'total free used',
      currentLoad: 'currentLoad',
    });
  }
}
