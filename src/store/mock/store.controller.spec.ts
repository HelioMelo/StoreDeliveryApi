import { PagedSearchResult } from './../dtos/paged-search-result';
import { Test, TestingModule } from '@nestjs/testing';
import { StoreController } from '../store.controller';
import { StoreService } from '../store.service';
import { StoreEntity } from '../entities/store.entity';
import { ReturnStore } from '../dtos/return-store.dto';
import { CreateStore } from '../dtos/Create-store.dto';
import { PagedSearchRequest } from '../dtos/paged-search-request'; // Importação correta do PagedSearchRequest

describe('StoreController', () => {
  let controller: StoreController;
  let service: StoreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StoreController],
      providers: [
        {
          provide: StoreService,
          useValue: {
            findAllStores: jest.fn(),
            findAllStoresPaginated: jest.fn(),
            findStoreById: jest.fn(),
            findNearbyStoresByCep: jest.fn(),
            createStore: jest.fn(),
            findStoresByState: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<StoreController>(StoreController);
    service = module.get<StoreService>(StoreService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAllCategories', () => {
    it('should return an array of stores', async () => {
      const storeEntity = new StoreEntity();
      const result = [new ReturnStore(storeEntity)];
      jest.spyOn(service, 'findAllStores').mockResolvedValue(result);

      expect(await controller.findAllCategories()).toBe(result);
    });
  });

  describe('findAllStoresPaginated', () => {
    it('should return paginated stores', async () => {
      const pagedResult: PagedSearchResult = {
        stores: [],
        total: 0,
        offset: 0,
        count: 0,
        limit: 0,
      };

      const pagedSearchRequest: PagedSearchRequest = {
        pageIndex: 1,
        pageSize: 10,
      };

      jest
        .spyOn(service, 'findAllStoresPaginated')
        .mockResolvedValue(pagedResult);

      expect(await controller.findAllStoresPaginated(pagedSearchRequest)).toBe(
        pagedResult,
      );
    });
  });

  describe('findStoreById', () => {
    it('should return a store by id', async () => {
      const storeEntity = new StoreEntity();
      const result = new ReturnStore(storeEntity);
      jest.spyOn(service, 'findStoreById').mockResolvedValue(result);

      expect(await controller.findStoreById(1)).toBe(result);
    });
  });

  describe('findNearbyStoresByCep', () => {
    it('should return nearby stores', async () => {
      const pagedResult: PagedSearchResult = {
        stores: [],
        total: 0,
        offset: 0,
        count: 0,
        limit: 0,
      };
      jest
        .spyOn(service, 'findNearbyStoresByCep')
        .mockResolvedValue(pagedResult);

      expect(await controller.findNearbyStoresByCep('12345', 0, 10)).toBe(
        pagedResult,
      );
    });
  });

  describe('createStore', () => {
    it('should create and return a new store', async () => {
      const result = new StoreEntity();
      const createStoreDto = new CreateStore();

      jest.spyOn(service, 'createStore').mockResolvedValue(result);

      expect(await controller.createStore(createStoreDto)).toBe(result);
    });
  });

  describe('findStoresByState', () => {
    it('should return stores by state', async () => {
      const storeEntity = new StoreEntity();
      const stores = [storeEntity];
      jest.spyOn(service, 'findStoresByState').mockResolvedValue(stores);

      const result = stores.map((store) => new ReturnStore(store));
      expect(await controller.findStoresByState('CA')).toEqual(result);
    });
  });
});
