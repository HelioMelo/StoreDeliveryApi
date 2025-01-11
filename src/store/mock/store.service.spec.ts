import { StoreTypeEnum } from 'src/store/enum/store-type.enum';
import { AddressService } from './../../address/address.service';
import { GoogleApiService } from 'src/google-api/google-api.service';
import { AddressEntity } from 'src/address/entities/address.entity';
import { StoreEntity } from 'src/store/entities/store.entity';
import { Test, TestingModule } from '@nestjs/testing';

import { getRepositoryToken } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { StoreService } from '../store.service';

describe('StoreService', () => {
  let service: StoreService;
  let storeRepository: jest.Mocked<Repository<StoreEntity>>;
  let addressRepository: jest.Mocked<Repository<AddressEntity>>;
  let googleApiService: jest.Mocked<GoogleApiService>;
  let addressService: jest.Mocked<AddressService>;

  beforeEach(async () => {
    // Mock do repositório de Store
    storeRepository = {
      find: jest.fn(),
      count: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    } as unknown as jest.Mocked<Repository<StoreEntity>>;

    // Mock do repositório de Address
    addressRepository = {
      create: jest.fn(),
      save: jest.fn(),
    } as unknown as jest.Mocked<Repository<AddressEntity>>;

    // Mock do GoogleApiService
    googleApiService = {
      googleMapsClient: jest.fn(),
      configService: {},
      findPlacests: jest.fn(),
      getCoordinatesByCep: jest.fn(),
    } as unknown as jest.Mocked<GoogleApiService>;

    // Mock do AddressService com todas as dependências necessárias
    addressService = {
      addressRepository: addressRepository,
      userService: {}, // Mock do userService, se necessário
      googleApiService: googleApiService,
      createAddress: jest.fn(),
      processAddress: jest.fn(),
    } as unknown as jest.Mocked<AddressService>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StoreService,
        { provide: getRepositoryToken(StoreEntity), useValue: storeRepository },
        {
          provide: getRepositoryToken(AddressEntity),
          useValue: addressRepository,
        },
        { provide: GoogleApiService, useValue: googleApiService },
        { provide: AddressService, useValue: addressService },
      ],
    }).compile();

    service = module.get<StoreService>(StoreService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new store', async () => {
    const createStoreDto = {
      store: 'testStore001',
      email: 'teststore@example.com',
      phone: '+123456789',
      storeType: StoreTypeEnum.LOJA,
      addresses: [
        {
          logradouro: '123 Test St',
          numberAddress: '100',
          cep: '12345-678',
          city: 'Test City',
          state: 'Test State',
        },
      ],
    };

    const mockAddress = new AddressEntity();
    mockAddress.logradouro = '123 Test St';
    mockAddress.numberAddress = '100';
    mockAddress.cep = '12345-678';
    mockAddress.city = 'Test City';
    mockAddress.state = 'Test State';

    // Mocking addressService
    addressService.processAddress = jest.fn().mockResolvedValue(mockAddress);

    storeRepository.create = jest.fn().mockReturnValue(new StoreEntity());
    storeRepository.save = jest.fn().mockResolvedValue(new StoreEntity());

    const result = await service.createStore(createStoreDto);
    expect(result).toBeDefined();
    expect(storeRepository.save).toHaveBeenCalled();
    expect(addressService.processAddress).toHaveBeenCalled();
  });

  it('should throw error if store not found', async () => {
    storeRepository.findOne = jest.fn().mockResolvedValue(null);

    try {
      await service.findStoreById(1);
    } catch (error) {
      expect(error.message).toBe('Store with id 1 not found');
    }
  });
});
