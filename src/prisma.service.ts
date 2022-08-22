import { PrismaClient } from '@prisma/client';

import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }

  async isHealthy() {
    try {
      await this.$queryRaw`SELECT 1`;
      return true;
    } catch (_error) {
      return false;
    }
  }
}
