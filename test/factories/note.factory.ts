import { PrismaService } from 'src/prisma/prisma.service';
import { faker } from '@faker-js/faker';

export class NoteFactory {
  static async build(prisma: PrismaService, userId: number) {
    return prisma.note.create({
      data: {
        title: faker.person.jobTitle(),
        note: faker.person.jobDescriptor(),
        userId: userId,
      },
    });
  }
}
