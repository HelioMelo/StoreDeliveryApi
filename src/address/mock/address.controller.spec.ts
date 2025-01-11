import { CreateAddressDTO } from './../dto/createAddress.dto';
import { Test, TestingModule } from '@nestjs/testing';
import { AddressController } from '../address.controller';
import { AddressService } from '../address.service';
import { AddressEntity } from '../entities/address.entity';
import { ReturnAddressDTO } from '../dto/returnAddress.dto';

describe('AddressController', () => {
  let controller: AddressController;
  let service: AddressService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AddressController],
      providers: [
        {
          provide: AddressService,
          useValue: {
            createAddress: jest.fn(),
            findAddressByUserId: jest.fn(),
            storeCreateAddress: jest.fn(),
            findAddressByStoreId: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AddressController>(AddressController);
    service = module.get<AddressService>(AddressService);
  });

  describe('createAddress', () => {
    it('should create a new address', async () => {
      const createAddressDTO: CreateAddressDTO = {
        logradouro: 'Test Street',
        city: 'Test City',
        state: 'Test State',
        cep: '12345',
        numberAddress: '123',
      };

      const mockAddress = new AddressEntity();
      mockAddress.id = 1;
      mockAddress.logradouro = 'Test Street';
      mockAddress.city = 'Test City';
      mockAddress.state = 'Test State';
      mockAddress.cep = '12345';
      mockAddress.numberAddress = '123';

      jest.spyOn(service, 'createAddress').mockResolvedValue(mockAddress);

      const result = await controller.createAddress(createAddressDTO, 1);
      expect(result).toEqual(mockAddress);
    });
  });

  describe('findAddressByUserId', () => {
    it('should return addresses by user ID', async () => {
      const mockAddressEntities: AddressEntity[] = [
        new AddressEntity(),
        new AddressEntity(),
      ];

      mockAddressEntities[0].id = 1;
      mockAddressEntities[1].id = 2;

      jest
        .spyOn(service, 'findAddressByUserId')
        .mockResolvedValue(mockAddressEntities);

      const result = await controller.findAddressByUserId(1);
      expect(result.length).toBe(2);
      expect(result[0]).toBeInstanceOf(ReturnAddressDTO);
    });
  });

  describe('createAddressStore', () => {
    it('should create a new store address', async () => {
      const createAddressDTO: CreateAddressDTO = {
        logradouro: 'Store Street',
        city: 'Store City',
        state: 'Store State',
        cep: '54321',
        numberAddress: '456',
      };

      const mockAddress = new AddressEntity();
      mockAddress.id = 1;
      mockAddress.logradouro = 'Store Street';
      mockAddress.city = 'Store City';
      mockAddress.state = 'Store State';
      mockAddress.cep = '54321';
      mockAddress.numberAddress = '456';

      jest.spyOn(service, 'storeCreateAddress').mockResolvedValue(mockAddress);

      const result = await controller.createAddressStore(createAddressDTO, 1);
      expect(result).toEqual(mockAddress);
    });
  });

  describe('findAddressByStoreId', () => {
    it('should return addresses by store ID', async () => {
      const mockAddressEntities: AddressEntity[] = [
        new AddressEntity(),
        new AddressEntity(),
      ];

      mockAddressEntities[0].id = 1;
      mockAddressEntities[1].id = 2;

      jest
        .spyOn(service, 'findAddressByStoreId')
        .mockResolvedValue(mockAddressEntities);

      const result = await controller.findAddressByStoreId(1);
      expect(result.length).toBe(2);
      expect(result[0]).toBeInstanceOf(ReturnAddressDTO);
    });
  });
});
