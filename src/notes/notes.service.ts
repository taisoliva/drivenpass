import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { NotesRepository } from './notes.repository';
import { Session } from '@prisma/client';

@Injectable()
export class NotesService {
  constructor(private readonly notesRepository: NotesRepository) {}

  async create(createNoteDto: CreateNoteDto, session: Session) {
    const note = await this.notesRepository.findTitle(createNoteDto.title);

    if (note && note.userId === session.userId)
      throw new ConflictException('This title is alread in use');

    return this.notesRepository.create(createNoteDto, session);
  }

  async findAll(session: Session) {
    return await this.notesRepository.findAll(session.userId);
  }

  async findOne(id: number, session: Session) {
    const note = await this.NotFoundOrForbbiden(id, session);
    return note;
  }

  async remove(id: number, session: Session) {
    await this.NotFoundOrForbbiden(id, session);
    return this.notesRepository.remove(id);
  }

  async NotFoundOrForbbiden(id: number, session: Session) {
    const note = await this.notesRepository.findOne(id);
    if (!note) throw new NotFoundException('credential not found');
    if (note.userId !== session.userId) throw new ForbiddenException();

    return note;
  }
}
