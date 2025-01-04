import { UserService } from '../../user/user.service';
import { UserEntityData } from '../../user/testData/user.data';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AddressService } from '../address.service';
import { AddressEntity } from '../entities/address.entity';
import { AddressData } from '../_testData/addressData';
import { CreateAddressData } from '../_testData/create-address.data';

describe('AddressService', () => {
  let service: AddressService;
  let addressRepository: Repository<AddressEntity>;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AddressService,
        {
          provide: UserService,
          useValue: {
            findUserById: jest.fn().mockResolvedValue(UserEntityData),
          },
        },
        {
          provide: getRepositoryToken(AddressEntity),
          useValue: {
            save: jest.fn().mockResolvedValue(AddressData),
            find: jest.fn().mockResolvedValue([AddressData]),
          },
        },
      ],
    }).compile();

    service = module.get<AddressService>(AddressService);
    userService = module.get<UserService>(UserService);
    addressRepository = module.get<Repository<AddressEntity>>(
      getRepositoryToken(AddressEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(userService).toBeDefined();
    expect(addressRepository).toBeDefined();
  });

  it('should return address after save', async () => {
    const address = await service.createAddress(
      CreateAddressData,
      UserEntityData.id,
    );

    expect(address).toEqual(AddressData);
  });

  it('should return error if exception in userService', async () => {
    jest.spyOn(userService, 'findUserById').mockRejectedValueOnce(new Error());

    await expect(
      service.createAddress(CreateAddressData, UserEntityData.id),
    ).rejects.toThrow();
  });

  it('should return all addresses to user', async () => {
    const addresses = await service.findAddressByUserId(UserEntityData.id);

    expect(addresses).toEqual([AddressData]);
  });

  it('should return not found if no address registered', async () => {
    jest.spyOn(addressRepository, 'find').mockResolvedValue([]);

    await expect(
      service.findAddressByUserId(UserEntityData.id),
    ).rejects.toThrow();
  });
});
