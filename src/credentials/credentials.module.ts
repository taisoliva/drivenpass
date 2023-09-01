import { Module } from '@nestjs/common';
import { CredentialsService } from './credentials.service';
import { CredentialsController } from './credentials.controller';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { CredentialsRepository } from './credentials.repository';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [CredentialsController],
  providers: [CredentialsService, CredentialsRepository],
  imports: [AuthModule, UsersModule, PrismaModule],
})
export class CredentialsModule {}
