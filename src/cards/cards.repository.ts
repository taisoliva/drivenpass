import { Injectable } from '@nestjs/common';
import { CreateCardDto } from './dto/create-card.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import Cryptr from 'cryptr';

@Injectable()
export class CardsRepository {
  private readonly cryptr: Cryptr;

  constructor(private readonly prisma: PrismaService) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const Cryptr = require('cryptr');
    this.cryptr = new Cryptr(process.env.CRYPTR);
  }
  async create(createCardDto: CreateCardDto, userId: number) {
    return await this.prisma.card.create({
      data: {
        title: createCardDto.title,
        cardNumber: createCardDto.cardNumber,
        name: createCardDto.name,
        cvc: this.cryptr.encrypt(createCardDto.cvc),
        expiry: createCardDto.date,
        password: this.cryptr.encrypt(createCardDto.password),
        type: createCardDto.type,
        virtual: createCardDto.virtual,
        userId,
      },
    });
  }

  async findTitle(title: string, userId: number) {
    return await this.prisma.card.findFirst({
      where: { title, userId },
    });
  }

  async findAll(userId: number) {
    const result = await this.prisma.card.findMany({
      where: {
        userId,
      },
    });

    const cards = result.map((item) => {
      item.cvc = this.cryptr.decrypt(item.cvc);
      item.password = this.cryptr.decrypt(item.password);
      return item;
    });

    return cards;
  }

  async findOne(id: number) {
    const result = await this.prisma.card.findFirst({
      where: { id },
    });

    return result
      ? {
          ...result,
          cvc: this.cryptr.decrypt(result.cvc),
          password: this.cryptr.decrypt(result.password),
        }
      : result;
  }

  async remove(id: number) {
    return await this.prisma.card.delete({
      where: {
        id,
      },
    });
  }
}
