import { Module } from '@nestjs/common';
import { NotesService } from './notes.service';
import { NotesController } from './notes.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { NotesRepository } from './notes.repository';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [NotesController],
  providers: [NotesService, NotesRepository],
  imports: [PrismaModule, UsersModule],
})
export class NotesModule {}
