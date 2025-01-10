import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';

import { StoreService } from './store.service';
import { ReturnStore } from './dtos/return-store.dto';
import { CreateStore } from './dtos/Create-store.dto';
import { StoreEntity } from './entities/store.entity';
import { PagedSearchRequest } from './dtos/paged-search-request';
import { PagedSearchResult } from './dtos/paged-search-result';

@Controller('store')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Get('all')
  async findAllCategories(): Promise<ReturnStore[]> {
    return this.storeService.findAllStores();
  }

  @Post('all/paginated') // Método GET para obter as lojas
  async findAllStoresPaginated(
    @Body() pagedSearchRequest: PagedSearchRequest,
  ): Promise<PagedSearchResult> {
    return this.storeService.findAllStoresPaginated(pagedSearchRequest);
  }

  @Get('storeById/:storeId')
  async findStoreById(@Param('storeId') storeId: number): Promise<ReturnStore> {
    return this.storeService.findStoreById(storeId); // Chama o método no serviço
  }

  @Get('storeByCep/:cep/:pageIndex/:pageSize')
  async findNearbyStoresByCep(
    @Param('cep') cep: string,
    @Param('pageIndex') pageIndex: number,
    @Param('pageSize') pageSize: number,
  ): Promise<any> {
    // Verificar se o CEP está presente
    if (!cep) {
      throw new BadRequestException('CEP is required');
    }

    // Chama o método findNearbyStoresByCep que usa o CEP para obter a latitude e longitude
    const nearbyStores = await this.storeService.findNearbyStoresByCep(
      cep,
      pageIndex,
      pageSize,
    );

    return nearbyStores;
  }

  @Post()
  async createStore(@Body() createStore: CreateStore): Promise<StoreEntity> {
    return this.storeService.createStore(createStore);
  }

  @Get('storeByState/:state')
  async findStoresByState(
    @Param('state') state: string,
  ): Promise<ReturnStore[]> {
    try {
      // Chama o serviço para buscar as lojas pelo estado
      const stores = await this.storeService.findStoresByState(state);

      // Se não houver lojas, retorna um erro de não encontrado
      if (stores.length === 0) {
        throw new NotFoundException(`No stores found for state: ${state}`);
      }

      // Retorna as lojas formatadas
      return stores.map((store) => new ReturnStore(store));
    } catch (error) {
      // Em caso de erro, lança uma exceção com a mensagem de erro
      throw error;
    }
  }
}
