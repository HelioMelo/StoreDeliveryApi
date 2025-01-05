import { Controller, Get, Param } from '@nestjs/common';
import { CorreiosApiService } from './correios-api.service';

@Controller('correios')
export class CorreiosApiController {
  constructor(private readonly correiosApiService: CorreiosApiService) {}

  @Get('/:cep')
  async findAll(@Param('cep') cep: string): Promise<any> {
    return this.correiosApiService.findAddressByCep(cep);
  }
}
