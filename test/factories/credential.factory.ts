import { PrismaService } from 'src/prisma/prisma.service';
import { faker } from '@faker-js/faker';

export class CredentialFactory {
  static async build(prisma: PrismaService, userId?: number) {
    return prisma.credential.create({
      data: {
        title: faker.company.name(),
        site: faker.internet.url(),
        username: faker.internet.avatar(),
        password: faker.internet.password(),
        userId: userId,
      },
    });
  }
}
