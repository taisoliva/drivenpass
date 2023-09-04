import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCardDto } from './dto/create-card.dto';
import { Session } from '@prisma/client';
import { CardsRepository } from './cards.repository';

@Injectable()
export class CardsService {
  constructor(private readonly cardRepository: CardsRepository) {}

  async create(createCardDto: CreateCardDto, session: Session) {
    const card = await this.cardRepository.findTitle(
      createCardDto.title,
      session.userId,
    );

    if (card && card.userId === session.userId) {
      throw new ConflictException('This title is alread in use');
    }

    return await this.cardRepository.create(createCardDto, session.userId);
  }

  async findAll(session: Session) {
    return await this.cardRepository.findAll(session.userId);
  }

  async findOne(id: number, session) {
    const card = await this.NotFoundOrForbbiden(id, session);
    return card;
  }

  async remove(id: number, session: Session) {
    await this.NotFoundOrForbbiden(id, session);
    return this.cardRepository.remove(id);
  }

  async NotFoundOrForbbiden(id: number, session: Session) {
    const card = await this.cardRepository.findOne(id);
    if (!card) throw new NotFoundException('credential not found');
    if (card.userId !== session.userId) throw new ForbiddenException();

    return card;
  }
}
