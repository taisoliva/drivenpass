import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { CardsService } from './cards.service';
import { CreateCardDto } from './dto/create-card.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { Session } from 'src/decorators/session.decorator';
import { Session as SessionPrisma } from '@prisma/client';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('card')
@UseGuards(AuthGuard)
@Controller('cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a Card',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Success',
  })
  @ApiBody({ type: CreateCardDto })
  create(
    @Body() createCardDto: CreateCardDto,
    @Session() session: SessionPrisma,
  ) {
    return this.cardsService.create(createCardDto, session);
  }

  @Get()
  findAll(@Session() session: SessionPrisma) {
    return this.cardsService.findAll(session);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Session() session: SessionPrisma) {
    return this.cardsService.findOne(+id, session);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Session() session: SessionPrisma) {
    return this.cardsService.remove(+id, session);
  }
}
