import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCredentialDto } from './dto/create-credential.dto';
import { Session } from '@prisma/client';
import { CredentialsRepository } from './credentials.repository';

@Injectable()
export class CredentialsService {
  constructor(private readonly credentialsRepository: CredentialsRepository) {}

  async create(session: Session, createCredentialDto: CreateCredentialDto) {
    const credential = await this.credentialsRepository.findTitle(
      createCredentialDto.title,
    );

    if (credential && credential.userId === session.userId)
      throw new ConflictException('This title is alread in use');

    return this.credentialsRepository.create(session, createCredentialDto);
  }

  async findAll(session: Session) {
    return await this.credentialsRepository.findAll(session.userId);
  }

  async NotFoundOrForbbiden(id: number, session: Session) {
    const credential = await this.credentialsRepository.findOneCredential(id);

    if (!credential) throw new NotFoundException('credential not found');

    if (credential.userId !== session.userId) throw new ForbiddenException();

    return credential;
  }

  async findOneCredential(id: number, session: Session) {
    const credential = this.NotFoundOrForbbiden(id, session);
    return credential;
  }

  async remove(id: number, session: Session) {
    await this.NotFoundOrForbbiden(id, session);
    return await this.credentialsRepository.remove(id);
  }
}
