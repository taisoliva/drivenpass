import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CredentialsService } from './credentials.service';
import { CreateCredentialDto } from './dto/create-credential.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { Session } from 'src/decorators/session.decorator';
import { Session as SessionPrisma } from '@prisma/client';

@UseGuards(AuthGuard)
@Controller('credentials')
export class CredentialsController {
  constructor(private readonly credentialsService: CredentialsService) {}

  @Post()
  create(
    @Body() createCredentialDto: CreateCredentialDto,
    @Session() session: SessionPrisma,
  ) {
    return this.credentialsService.create(session, createCredentialDto);
  }

  @Get()
  findAll(@Session() session: SessionPrisma) {
    return this.credentialsService.findAll(session);
  }

  @Get(':id')
  findOneCredential(
    @Param('id') id: string,
    @Session() session: SessionPrisma,
  ) {
    return this.credentialsService.findOneCredential(+id, session);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Session() session: SessionPrisma) {
    return this.credentialsService.remove(+id, session);
  }
}
