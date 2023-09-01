import { PrismaService } from 'src/prisma/prisma.service';
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';

export class UserFactory {
  static async build(prisma: PrismaService, email?: string, password?: string) {
    return prisma.user.create({
      data: {
        email: email ? email : faker.internet.email(),
        password: password ? password : await bcrypt.hash('S#nhaF3orte!', 10),
      },
    });
  }
}
