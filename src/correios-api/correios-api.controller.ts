// import { ResponsePriceCorreiosDTO } from './dto/response-price-correios.dto';
import { ReturnCepDTO } from './dto/return-cep.dto';
import { Controller, Get, Param, Query } from '@nestjs/common';
import { CorreiosApiService } from './correios-api.service';
import { ResponsePriceCorreiosDTO } from './dto/response-price-correios.dto';
import { ProductCorreioDTO } from './dto/product.correio.dto';

@Controller('correios')
export class CorreiosApiController {
  constructor(private readonly correiosApiService: CorreiosApiService) {}

  @Get('/price')
  async priceDeliver(
    @Query('cep') cep: string,
    @Query() productCorreioDTO: ProductCorreioDTO,
  ): Promise<ResponsePriceCorreiosDTO> {
    return this.correiosApiService.findPriceDeliver(cep, productCorreioDTO);
  }

  @Get(':cep')
  async findAll(@Param('cep') cep: string): Promise<ReturnCepDTO> {
    return this.correiosApiService.findAddressByCep(cep);
  }

  // @Post('calcular')
  // async calculatePriceAndDeadline(
  //   @Body()
  //   data: {
  //     cepOrigem: string;
  //     cepDestino: string;
  //     comprimento: number;
  //     largura: number;
  //     altura: number;
  //   },
  // ) {
  //   const { cepOrigem, cepDestino, comprimento, largura, altura } = data;

  //   const url = 'https://www.correios.com.br/@@precosEPrazosView';
  //   const requestData = {
  //     cepOrigem,
  //     cepDestino,
  //     comprimento,
  //     largura,
  //     altura,
  //   };

  //   try {
  //     // Envia a requisição POST para a API dos Correios
  //     const response = await axios.post(url, requestData);

  //     // Retorna a resposta da API dos Correios
  //     return response.data;
  //   } catch (error) {
  //     // Se ocorrer erro, exibe uma mensagem de erro
  //     throw new Error('Erro ao consultar os preços e prazos: ' + error.message);
  //   }
  // }
}
