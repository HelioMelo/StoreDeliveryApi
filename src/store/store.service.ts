import { AddressService } from './../address/address.service';
import { GoogleApiService } from './../google-api/google-api.service';
import { AddressEntity } from 'src/address/entities/address.entity';
import { StoreEntity } from './entities/store.entity';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CountProduct } from '../product/dtos/count-product.dto';
import { Repository } from 'typeorm';
import { ReturnStore } from './dtos/return-store.dto';
import { CreateStore } from './dtos/Create-store.dto';

import { StoreTypeEnum } from './enum/store-type.enum';
import { Utils } from './utils/utils';
import { PagedSearchRequest } from './dtos/paged-search-request';
import { PagedSearchResult } from './dtos/paged-search-result';

@Injectable()
export class StoreService {
  constructor(
    @InjectRepository(StoreEntity)
    private storeRepository: Repository<StoreEntity>,

    @InjectRepository(AddressEntity)
    private addressRepository: Repository<AddressEntity>,
    private readonly googleApiService: GoogleApiService,
    private readonly addressService: AddressService,
  ) {}
  // Método para retornar todas as lojas páginadas
  async findAllStoresPaginated(
    pagedSearchRequest: PagedSearchRequest,
  ): Promise<PagedSearchResult> {
    const { pageIndex, pageSize } = pagedSearchRequest;

    // Verificando se o pageSize é válido
    const pageLimit = pageSize > 0 ? pageSize : 10;

    // Obtenção do total de registros
    const totalRecords = await this.storeRepository.count();

    // Paginação (skip e take)
    const stores = await this.storeRepository.find({
      relations: ['products', 'addresses'],
      skip: pageIndex * pageLimit,
      take: pageLimit,
      order: {
        id: 'ASC', // Ordenando pelo campo 'id' em ordem crescente
      },
    });

    // Mapeamento dos dados (conforme seu DTO ReturnStore)
    const searchResult = stores.map(
      (store) => new ReturnStore(store, store.products?.length || 0),
    );

    // Cálculo da quantidade total de páginas
    const pageCount = Math.ceil(totalRecords / pageLimit);

    // Retornando o resultado da busca paginada
    return {
      store: searchResult,
      total: totalRecords,
      offset: pageIndex,
      count: pageCount,
      limit: pageLimit,
    };
  }
  // Método para verificar a quantidade de produtos de uma loja
  findAmountStoreInProducts(
    store: StoreEntity,
    countList: CountProduct[],
  ): number {
    const count = countList.find(
      (itemCount) => itemCount.store_id === store.id,
    );

    if (count) {
      return count.total;
    }

    return 0;
  }

  // Buscar loja por ID
  async findStoreById(storeId: number): Promise<ReturnStore> {
    const store = await this.storeRepository.findOne({
      where: { id: storeId },
      relations: ['products', 'addresses'],
    });

    if (!store) {
      throw new Error(`Store with id ${storeId} not found`);
    }

    return new ReturnStore(store, store.products?.length || 0);
  }

  // Buscar loja por nome
  async findStoreByName(store: string): Promise<StoreEntity> {
    const stores = await this.storeRepository.findOne({
      where: { store },
    });

    if (!store) {
      throw new NotFoundException(`Store name ${store} not found`);
    }

    return stores;
  }

  // Buscar lojas por estado
  async findStoresByState(state: string): Promise<StoreEntity[]> {
    const stores = await this.storeRepository
      .createQueryBuilder('store')
      .innerJoinAndSelect('store.addresses', 'address')
      .where('address.state = :state', { state })
      .getMany();

    return stores;
  }

  // Criar nova loja
  async createStore(createStoreDto: CreateStore): Promise<StoreEntity> {
    const { addresses, ...storeData } = createStoreDto;

    if (addresses && addresses.length > 0) {
      for (let i = 0; i < addresses.length; i++) {
        // Processa o endereço com a API do Google
        addresses[i] = await this.addressService.processAddress(addresses[i]);
      }

      const store = this.storeRepository.create(storeData);

      store.addresses = addresses.map((address) =>
        this.addressRepository.create(address),
      );

      return this.storeRepository.save(store);
    }
  }

  // Buscar todas as lojas
  async findAllStores(): Promise<ReturnStore[]> {
    const stores = await this.storeRepository.find({
      relations: ['products', 'addresses'],
    });

    return stores.map(
      (store) => new ReturnStore(store, store.products?.length || 0),
    );
  }

  // Buscar lojas próximas com base no CEP
  // Buscar lojas próximas com base no CEP
  async findNearbyStoresByCep(
    cep: string,
    pageIndex: number,
    pageSize: number,
  ): Promise<PagedSearchResult> {
    try {
      const { latitude, longitude } =
        await this.googleApiService.getCoordinatesByCep(cep);

      const stores = await this.storeRepository.find({
        relations: ['addresses'],
      });

      // Atualizar distâncias e verificar endereços
      const updatedStores = stores.map((store) => {
        store.addresses = store.addresses.map((address) => {
          if (address.latitude && address.longitude) {
            address.distance = Utils.calculateDistance(
              { latitude, longitude },
              {
                latitude: parseFloat(address.latitude),
                longitude: parseFloat(address.longitude),
              },
            );
          }
          return address;
        });
        return store;
      });

      // Filtrar lojas e PDVs próximos (até 50 km)
      const storesWithin50Km = updatedStores.filter((store) =>
        store.addresses.some((address) =>
          Utils.hasAddressWithinDistance([address], 50),
        ),
      );

      // Total de lojas dentro de 50 km
      const totalRecords = storesWithin50Km.length;

      // Paginação: aplicando skip e take
      const pagedStores = storesWithin50Km.slice(
        pageIndex * pageSize,
        (pageIndex + 1) * pageSize,
      );

      // Se houver lojas dentro de 50 km
      if (pagedStores.length > 0) {
        return {
          stores: pagedStores.map((store) => ({
            ...store,
            addresses: Utils.filterAddressesByDistance(store.addresses, 50),
          })),
          total: totalRecords,
          offset: pageIndex,
          count: Math.ceil(totalRecords / pageSize), // Calcular a quantidade total de páginas
          limit: pageSize,
        };
      }

      // Caso contrário, filtrar e retornar apenas as lojas a mais de 50 km
      const storesAbove50Km = updatedStores.filter(
        (store) => store.storeType === StoreTypeEnum.LOJA,
      );

      const totalRecordsAbove50Km = storesAbove50Km.length;

      const pagedStoresAbove50Km = storesAbove50Km.slice(
        pageIndex * pageSize,
        (pageIndex + 1) * pageSize,
      );

      return {
        stores: pagedStoresAbove50Km.map((store) => ({
          ...store,
          addresses: Utils.filterAddressesByDistance(
            store.addresses,
            Number.MAX_SAFE_INTEGER, // Sem limite de distância
          ),
        })),
        total: totalRecordsAbove50Km,
        offset: pageIndex,
        count: Math.ceil(totalRecordsAbove50Km / pageSize),
        limit: pageSize,
      };
    } catch (error) {
      console.error('Error fetching nearby stores by CEP:', error);
      throw new BadRequestException('Error fetching nearby stores');
    }
  }

  // Aplicar regras para lojas ou PDVs com base na distância
  applyStoreRules(address: AddressEntity, store: StoreEntity): boolean {
    return Utils.applyStoreRules(address, store);
  }
}
