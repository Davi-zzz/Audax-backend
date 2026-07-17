import { PrismaClient } from '@prisma/client';
import { PrismaService } from './prisma.service';

describe('PrismaService', () => {
  const originalRepositoryType = process.env.REPOSITORY_TYPE;

  afterEach(() => {
    if (originalRepositoryType === undefined) {
      delete process.env.REPOSITORY_TYPE;
    } else {
      process.env.REPOSITORY_TYPE = originalRepositoryType;
    }
  });

  it('should be a typed PrismaClient', () => {
    const service = new PrismaService();
    expect(service).toBeInstanceOf(PrismaClient);
  });

  it('should not connect to database when REPOSITORY_TYPE is not prisma', async () => {
    process.env.REPOSITORY_TYPE = 'in-memory';
    const service = new PrismaService();
    const connectSpy = jest.spyOn(service, '$connect').mockResolvedValue(undefined);

    await service.onModuleInit();

    expect(connectSpy).not.toHaveBeenCalled();
  });

  it('should connect to database when REPOSITORY_TYPE is prisma', async () => {
    process.env.REPOSITORY_TYPE = 'prisma';
    const service = new PrismaService();
    const connectSpy = jest.spyOn(service, '$connect').mockResolvedValue(undefined);

    await service.onModuleInit();

    expect(connectSpy).toHaveBeenCalled();
  });
});
