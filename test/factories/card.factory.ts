import { PrismaService } from 'src/prisma/prisma.service';
import { faker } from '@faker-js/faker';
import Cryptr from 'cryptr';

export class CardFactory {
  private readonly cryptr: Cryptr;

  constructor() {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const Cryptr = require('cryptr');
    this.cryptr = new Cryptr(process.env.CRYPTR);
  }

  async build(prisma: PrismaService, userId?: number) {
    return prisma.card.create({
      data: {
        title: faker.company.name(),
        cardNumber: faker.string.alphanumeric({ length: 16 }),
        name: faker.person.firstName(),
        cvc: this.cryptr.encrypt(faker.string.alphanumeric({ length: 3 })),
        expiry: new Date(),
        password: this.cryptr.encrypt(faker.internet.password()),
        virtual: faker.datatype.boolean(),
        type: 'credito',
        userId,
      },
    });
  }
}
