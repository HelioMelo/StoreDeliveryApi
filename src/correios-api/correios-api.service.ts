import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosError, AxiosResponse } from 'axios';

@Injectable()
export class CorreiosApiService {
  constructor(private readonly httpService: HttpService) {}
  URL_CORREIOS = process.env.URL_CEP_CORREIOS;

  async findAddressByCep(cep: string): Promise<AxiosResponse<any>> {
    return this.httpService.axiosRef
      .get<any>(this.URL_CORREIOS.replace('{CEP}', cep))
      .then((result) => {
        if (result.data.erro === 'true') {
          throw new NotFoundException(`CEP: ${cep} not found`);
        }

        return result.data;
      })
      .catch((error: AxiosError) => {
        throw new BadRequestException(
          `Erro in connection ${error.message}
            `,
        );
      });
  }
}
