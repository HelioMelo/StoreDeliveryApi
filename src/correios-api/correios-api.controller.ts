import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { CorreiosApiService } from './correios-api.service';
import { ResponsePriceCorreiosDTO } from './dto/response-price-correios.dto';
import { ProductCorreioDTO } from './dto/product.correio.dto';
import { ReturnCepDTO } from './dto/return-cep.dto';

@Controller('correios')
@ApiTags('Correios API')
export class CorreiosApiController {
  constructor(private readonly correiosApiService: CorreiosApiService) {}

  @Get('/price')
  @ApiOperation({ summary: 'Get delivery price' })
  @ApiQuery({
    name: 'cep',
    description: 'Postal code for delivery',
    required: true,
  })
  @ApiQuery({
    name: 'productCorreioDTO',
    description: 'Product details for delivery',
    required: true,
    type: ProductCorreioDTO,
  })
  @ApiResponse({
    status: 200,
    description: 'Successful response',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async priceDeliver(
    @Query('cep') cep: string,
    @Query() productCorreioDTO: ProductCorreioDTO,
  ): Promise<ResponsePriceCorreiosDTO> {
    return this.correiosApiService.findPriceDeliver(cep, productCorreioDTO);
  }

  @Get(':cep')
  @ApiOperation({ summary: 'Get address by CEP' })
  @ApiResponse({
    status: 200,
    description: 'Successful response',
    type: ReturnCepDTO,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async findAll(@Param('cep') cep: string): Promise<ReturnCepDTO> {
    return this.correiosApiService.findAddressByCep(cep);
  }
}
