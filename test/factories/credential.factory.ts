import { PrismaService } from 'src/prisma/prisma.service';
import { faker } from '@faker-js/faker';
import Cryptr from 'cryptr';

export class CredentialFactory {
  private readonly cryptr: Cryptr;

  constructor() {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const Cryptr = require('cryptr');
    this.cryptr = new Cryptr(process.env.CRYPTR);
  }

  async build(prisma: PrismaService, userId?: number) {
    return prisma.credential.create({
      data: {
        title: faker.company.name(),
        site: faker.internet.url(),
        username: faker.internet.avatar(),
        password: this.cryptr.encrypt(faker.internet.password()),
        userId: userId,
      },
    });
  }
}
