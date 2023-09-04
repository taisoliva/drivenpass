import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EraseRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findUser(userId: number) {
    return await this.prisma.user.findFirst({
      where: { id: userId },
    });
  }

  async remove(userId: number) {
    await this.prisma.credential.deleteMany({
      where: { userId },
    });

    await this.prisma.card.deleteMany({
      where: { userId },
    });

    await this.prisma.note.deleteMany({
      where: { userId },
    });

    await this.prisma.session.deleteMany({
      where: { userId },
    });

    await this.prisma.user.deleteMany({
      where: { id: userId },
    });
  }
}
