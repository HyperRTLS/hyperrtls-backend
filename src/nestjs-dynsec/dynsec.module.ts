import { Global, Logger, Module, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigurableModuleClass } from './dynsec.module-definition';

import { DynamicSecurityController } from './dynsec.controller';
import { DynamicSecurityService } from './dynsec.service';

@Global()
@Module({
  providers: [DynamicSecurityController, DynamicSecurityService],
  exports: [DynamicSecurityService],
})
export class DynamicSecurityModule
  extends ConfigurableModuleClass
  implements OnApplicationBootstrap
{
  private readonly logger = new Logger(DynamicSecurityModule.name);

  constructor(
    private readonly dynsecController: DynamicSecurityController,
    private readonly dynsecService: DynamicSecurityService,
  ) {
    super();
  }

  public async onApplicationBootstrap() {
    this.logger.log('Initializing module...');

    await this.dynsecController.init();

    const [roles, groups, clients] = await Promise.all([
      this.dynsecService.listRoles({}),
      this.dynsecService.listGroups({}),
      this.dynsecService.listClients({}),
    ]);

    this.logger.log(
      `Detected ${roles.totalCount} roles, ${groups.totalCount} groups, and ${clients.totalCount} clients in total`,
    );

    this.logger.log('Successfully initialized module');
  }
}
