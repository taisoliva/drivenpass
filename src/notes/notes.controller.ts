import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { Session } from 'src/decorators/session.decorator';
import { Session as SessionPrisma } from '@prisma/client';

@UseGuards(AuthGuard)
@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  create(
    @Body() createNoteDto: CreateNoteDto,
    @Session() session: SessionPrisma,
  ) {
    return this.notesService.create(createNoteDto, session);
  }

  @Get()
  findAll(@Session() session: SessionPrisma) {
    return this.notesService.findAll(session);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Session() session: SessionPrisma) {
    return this.notesService.findOne(+id, session);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Session() session: SessionPrisma) {
    return this.notesService.remove(+id, session);
  }
}
