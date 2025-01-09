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
import { getDistance } from 'geolib';
import { StoreTypeEnum } from './enum/store-type.enum';

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
  async findNearbyStoresByCep(cep: string): Promise<StoreEntity[]> {
    try {
      const { latitude, longitude } =
        await this.googleApiService.getCoordinatesByCep(cep);

      const stores = await this.storeRepository.find({
        relations: ['addresses'],
      });

      const updatedStores = stores.map((store) => {
        if (!store.addresses || store.addresses.length === 0) {
          return store;
        }

        store.addresses = store.addresses.map((address) => {
          if (address.latitude && address.longitude) {
            const distanceInMeters = getDistance(
              { latitude, longitude },
              {
                latitude: parseFloat(address.latitude),
                longitude: parseFloat(address.longitude),
              },
            );
            const distanceInKilometers = distanceInMeters / 1000;
            address.distance = distanceInKilometers.toString();
          } else {
            console.log('Address has no coordinates:', address);
          }
          return address;
        });

        return store;
      });

      const filteredStores = updatedStores.map((store) => ({
        ...store,
        addresses: store.addresses.filter((address) =>
          store.storeType === StoreTypeEnum.LOJA
            ? this.rulesStore(address, store)
            : this.rulesPDV(address, store),
        ),
      }));

      return filteredStores;
    } catch (error) {
      console.error('Error fetching nearby stores by CEP:', error);
      throw new BadRequestException('Error fetching nearby stores');
    }
  }

  // Regras para lojas
  rulesStore(address: AddressEntity, store: StoreEntity) {
    if (
      parseFloat(address.distance) < 50 &&
      store.storeType === StoreTypeEnum.LOJA
    ) {
      return true;
    }
    if (
      parseFloat(address.distance) >= 50 &&
      store.storeType === StoreTypeEnum.LOJA
    ) {
      return true;
    }

    return false;
  }

  // Regras para PDV
  rulesPDV(address: AddressEntity, store: StoreEntity) {
    if (
      parseFloat(address.distance) <= 50 &&
      store.storeType === StoreTypeEnum.PDV
    ) {
      return true;
    }

    if (
      parseFloat(address.distance) >= 50 &&
      store.storeType === StoreTypeEnum.PDV
    ) {
      return false;
    }
    return false;
  }
}
