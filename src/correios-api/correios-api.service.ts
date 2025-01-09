import { ResponsePriceCorreiosDTO } from './dto/response-price-correios.dto';
import { AddressService } from './../address/address.service';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosError } from 'axios';
import { ReturnCepExtDTO } from './dto/return-cep-ext.dto';
import { ReturnCepDTO } from './dto/return-cep.dto';
import { AddressEntity } from 'src/address/entities/address.entity';
import { ProductCorreioDTO } from './dto/product.correio.dto';

@Injectable()
export class CorreiosApiService {
  URL_CORREIOS = process.env.URL_CEP_CORREIOS;
  CEP_COMPANY = process.env.CEP_COMPANY;
  constructor(
    private readonly httpService: HttpService,
    private readonly addressService: AddressService,
  ) {}

  async findAddressByCep(cep: string): Promise<ReturnCepDTO> {
    const returnCep: ReturnCepExtDTO = await this.httpService.axiosRef
      .get<ReturnCepExtDTO>(this.URL_CORREIOS.replace('{CEP}', cep))
      .then((result) => {
        if (result.data.erro === 'true') {
          throw new NotFoundException(`CEP: ${cep} not found`);
        }

        return result.data;
      })
      .catch((error: AxiosError) => {
        throw new BadRequestException(`Error in connection: ${error.message}`);
      });

    const address: AddressEntity | undefined = await this.addressService
      .findCityByName(returnCep.localidade, returnCep.uf)
      .catch(() => undefined);

    const returnCepDTO = new ReturnCepDTO(returnCep);

    if (address) {
      returnCepDTO.city = address.city;
      returnCepDTO.state = address.state;
    }

    return returnCepDTO;
  }

  async findPriceDeliver(
    cep: string,
    productCorreioDTO: ProductCorreioDTO,
  ): Promise<ResponsePriceCorreiosDTO> {
    const url = 'https://www.correios.com.br/@@precosEPrazosView';

    // Definição correta do requestBody
    const requestBody = {
      cepDestino: cep,
      cepOrigem: this.CEP_COMPANY,
      comprimento: '20',
      largura: productCorreioDTO.width,
      altura: productCorreioDTO.height,
    };

    const response = await this.httpService.post(url, requestBody).toPromise();

    return response.data;
  }
}
