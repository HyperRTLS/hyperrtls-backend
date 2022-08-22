import * as si from 'systeminformation';

import { Injectable } from '@nestjs/common';

import { DynamicSecurityService } from 'src/nestjs-dynsec/dynsec.service';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class RestSystemService {
  constructor(
    private readonly dynsecService: DynamicSecurityService,
    private readonly prismaService: PrismaService,
  ) {}

  async getSystemHealth() {
    const dynsec = this.dynsecService.isConnected();
    const gateway = true; // TODO
    const prisma = await this.prismaService.isHealthy();
    return { dynsec, gateway, prisma };
  }

  async getSystemInfo() {
    return si.get({
      osInfo: 'platform distro release kernel arch',
      mem: 'total free used',
      currentLoad: 'currentLoad',
    });
  }
}
