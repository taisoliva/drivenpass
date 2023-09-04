import { Injectable } from '@nestjs/common';
import { CreateCredentialDto } from './dto/create-credential.dto';
import { Session } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import Cryptr from 'cryptr';

@Injectable()
export class CredentialsRepository {
  private readonly cryptr: Cryptr;
  constructor(private readonly prisma: PrismaService) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const Cryptr = require('cryptr');
    this.cryptr = new Cryptr(process.env.CRYPTR);
  }

  async create(session: Session, createCredentialDto: CreateCredentialDto) {
    return await this.prisma.credential.create({
      data: {
        title: createCredentialDto.title,
        site: createCredentialDto.url,
        username: createCredentialDto.username,
        password: this.cryptr.encrypt(createCredentialDto.password),
        userId: session.userId,
      },
    });
  }

  async findTitle(title: string) {
    return await this.prisma.credential.findFirst({
      where: {
        title,
      },
    });
  }

  async findAll(userId: number) {
    const result = await this.prisma.credential.findMany({
      where: {
        userId,
      },
    });

    const credentials = result.map((item) => {
      item.password = this.cryptr.decrypt(item.password);
      return item;
    });

    return credentials;
  }

  async findOneCredential(id: number) {
    const result = await this.prisma.credential.findFirst({
      where: { id },
    });

    return result
      ? {
          ...result,
          password: this.cryptr.decrypt(result.password),
        }
      : result;
  }

  async remove(id: number) {
    return await this.prisma.credential.delete({
      where: { id },
    });
  }
}
