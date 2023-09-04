import { Module } from '@nestjs/common';
import { EraseService } from './erase.service';
import { EraseController } from './erase.controller';
import { UsersModule } from 'src/users/users.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { EraseRepository } from './erase.repository';

@Module({
  controllers: [EraseController],
  providers: [EraseService, EraseRepository],
  imports: [UsersModule, PrismaModule],
})
export class EraseModule {}
