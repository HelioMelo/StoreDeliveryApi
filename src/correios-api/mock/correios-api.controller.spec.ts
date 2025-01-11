import { ProductCorreioDTO } from './../dto/product.correio.dto';
<<<<<<< HEAD

=======
import { ResponsePriceCorreiosDTO } from './../../../dist/correios-api/dto/response-price-correios.dto.d';
>>>>>>> 09c725a (feat: update delivery API and remove unused test files)
import { CorreiosApiService } from './../correios-api.service';
import { CorreiosApiController } from './../correios-api.controller';
import { Test, TestingModule } from '@nestjs/testing';

import { HttpStatus } from '@nestjs/common';
import { ReturnCepDTO } from '../dto/return-cep.dto';
<<<<<<< HEAD
import { ResponsePriceCorreiosDTO } from '../dto/response-price-correios.dto';
=======
>>>>>>> 09c725a (feat: update delivery API and remove unused test files)

describe('CorreiosApiController', () => {
  let controller: CorreiosApiController;
  let service: CorreiosApiService;

  beforeEach(async () => {
    const mockCorreiosApiService = {
      findPriceDeliver: jest.fn().mockResolvedValue({
        status: 200,
        mensagemPrecoAgencia: 'Preço válido',
        prazo: '3 dias úteis',
        url: 'http://example.com',
        mensagemPrecoPPN: 'Preço PPN',
        codProdutoAgencia: '12345',
        precoPPN: '10.00',
        codProdutoPPN: '67890',
        mensagemPrazo: 'Prazo válido',
        msg: 'Sucesso',
        precoAgencia: '15.00',
        urlTitulo: 'http://example.com/titulo',
      } as ResponsePriceCorreiosDTO),
      findAddressByCep: jest.fn().mockResolvedValue({
        street: 'Rua Teste',
        city: 'Cidade Teste',
        state: 'Estado Teste',
      } as ReturnCepDTO),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CorreiosApiController],
      providers: [
        {
          provide: CorreiosApiService,
          useValue: mockCorreiosApiService,
        },
      ],
    }).compile();

    controller = module.get<CorreiosApiController>(CorreiosApiController);
    service = module.get<CorreiosApiService>(CorreiosApiService);
  });

  describe('priceDeliver', () => {
    it('should return the delivery price when valid parameters are passed', async () => {
<<<<<<< HEAD
      // Mock dos valores esperados
      const cep = '12345678';
      const cepStore = '87654321'; // Novo argumento
=======
      const cep = '12345678';
>>>>>>> 09c725a (feat: update delivery API and remove unused test files)
      const product: ProductCorreioDTO = {
        length: '20',
        height: '30',
        width: '10',
      };

<<<<<<< HEAD
      // Mock da resposta do serviço
      const mockResponse: ResponsePriceCorreiosDTO = {
        status: 200,
        mensagemPrecoAgencia: 'Preço calculado com sucesso',
        prazo: '3 dias úteis',
        url: 'http://example.com/delivery',
        mensagemPrecoPPN: 'Preço promocional disponível',
        codProdutoAgencia: 'AG123',
        precoPPN: '10.00',
        codProdutoPPN: 'PPN456',
        mensagemPrazo: 'Entrega rápida disponível',
        msg: 'Sucesso',
        precoAgencia: '15.00',
        urlTitulo: 'Detalhes da Entrega',
      };

      jest.spyOn(service, 'findPriceDeliver').mockResolvedValue(mockResponse);

      // Chamada ao método do controller
      const result = await controller.priceDeliver(cep, cepStore, product);

      // Verificações
      expect(result).toEqual(mockResponse);
      expect(service.findPriceDeliver).toHaveBeenCalledWith(
        cep,
        cepStore,
        product,
      );
=======
      const result = await controller.priceDeliver(cep, product);

      expect(result).toHaveProperty('precoAgencia', '15.00');
      expect(result).toHaveProperty('prazo', '3 dias úteis');
      expect(service.findPriceDeliver).toHaveBeenCalledWith(cep, product);
>>>>>>> 09c725a (feat: update delivery API and remove unused test files)
    });

    it('should throw an error if required parameters are missing', async () => {
      const cep = '12345678';
<<<<<<< HEAD
      const cepStore = null; // Argumento ausente
      const product = null; // Argumento ausente

      try {
        await controller.priceDeliver(cep, cepStore, product);
      } catch (error) {
        expect(error.status).toBe(HttpStatus.BAD_REQUEST);
        expect(error.message).toBe('Missing required parameters'); // Mensagem de erro esperada
=======
      const product = null;

      try {
        await controller.priceDeliver(cep, product);
      } catch (error) {
        expect(error.status).toBe(HttpStatus.BAD_REQUEST);
>>>>>>> 09c725a (feat: update delivery API and remove unused test files)
      }
    });
  });

  describe('findAll', () => {
    it('should return address by CEP when valid CEP is passed', async () => {
      const cep = '12345678';
      const result = await controller.findAll(cep);

      expect(result).toHaveProperty('street', 'Rua Teste');
      expect(result).toHaveProperty('city', 'Cidade Teste');
      expect(result).toHaveProperty('state', 'Estado Teste');
      expect(service.findAddressByCep).toHaveBeenCalledWith(cep);
    });

    it('should return 400 if invalid CEP is provided', async () => {
      const cep = 'invalid';
      try {
        await controller.findAll(cep);
      } catch (error) {
        expect(error.status).toBe(HttpStatus.BAD_REQUEST);
      }
    });
  });
});
