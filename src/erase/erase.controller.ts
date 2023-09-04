import { Controller, Body, Delete, UseGuards } from '@nestjs/common';
import { EraseService } from './erase.service';
import { CreateEraseDto } from './dto/create-erase.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { Session } from 'src/decorators/session.decorator';
import { Session as SessionPrisma } from '@prisma/client';

@UseGuards(AuthGuard)
@Controller('erase')
export class EraseController {
  constructor(private readonly eraseService: EraseService) {}

  @Delete()
  remove(
    @Body() createEraseDto: CreateEraseDto,
    @Session() session: SessionPrisma,
  ) {
    return this.eraseService.remove(createEraseDto, session);
  }
}
