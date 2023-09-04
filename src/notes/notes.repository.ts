import { Injectable } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Session } from '@prisma/client';

@Injectable()
export class NotesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(createNoteDto: CreateNoteDto, session: Session) {
    return await this.prisma.note.create({
      data: {
        title: createNoteDto.title,
        note: createNoteDto.note,
        userId: session.userId,
      },
    });
  }

  async findAll(userId: number) {
    return await this.prisma.note.findMany({
      where: { userId },
    });
  }

  async findTitle(title: string) {
    return await this.prisma.note.findFirst({
      where: { title },
    });
  }

  async findOne(id: number) {
    return await this.prisma.note.findFirst({
      where: { id },
    });
  }

  async remove(id: number) {
    return await this.prisma.note.delete({
      where: {
        id,
      },
    });
  }
}
