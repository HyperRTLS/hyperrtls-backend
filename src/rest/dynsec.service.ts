import { Injectable } from '@nestjs/common';

import { DynamicSecurityService } from '../nestjs-dynsec/dynsec.service';

@Injectable()
export class RestDynamicSecurityService {
  constructor(private readonly dynsecService: DynamicSecurityService) {}

  async getInfo() {
    const [{ roles }, { groups }, { clients }] = await Promise.all([
      this.dynsecService.listRoles({ verbose: true }),
      this.dynsecService.listGroups({ verbose: true }),
      this.dynsecService.listClients({ verbose: true }),
    ]);

    return {
      roles,
      groups,
      clients,
    };
  }
}
