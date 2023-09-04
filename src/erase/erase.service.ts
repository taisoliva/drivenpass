import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateEraseDto } from './dto/create-erase.dto';
import { Session } from '@prisma/client';
import { EraseRepository } from './erase.repository';
import * as bcrypt from 'bcrypt';

@Injectable()
export class EraseService {
  constructor(private readonly eraseRepository: EraseRepository) {}

  async remove(createEraseDto: CreateEraseDto, session: Session) {
    const user = await this.eraseRepository.findUser(session.userId);
    const passwordUser = bcrypt.compareSync(
      createEraseDto.password,
      user.password,
    );

    if (!passwordUser) throw new UnauthorizedException('Senha errada');

    return await this.eraseRepository.remove(session.userId);
  }
}
