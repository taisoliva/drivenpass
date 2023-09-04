import { Controller, Get, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('app')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/health')
  @ApiOperation({
    summary: 'Checks Apis Health',
    description: 'Request to the app',
  })
  @ApiResponse({ status: HttpStatus.OK, description: 'Everything is okay!' })
  getHello(): string {
    return this.appService.getHealth();
  }
}
