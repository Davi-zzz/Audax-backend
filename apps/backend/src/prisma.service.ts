import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    if (process.env.REPOSITORY_TYPE === 'prisma') await this.$connect();
  }

  async onModuleDestroy() {
    if (process.env.REPOSITORY_TYPE === 'prisma') await this.$disconnect();
  }
}
