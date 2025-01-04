import { UserEntityData } from './../../user/testData/user.data';
import { AddressData } from '../_testData/addressData';
import { CreateAddressData } from '../_testData/create-address.data';

import { Test, TestingModule } from '@nestjs/testing';
import { AddressController } from '../address.controller';
import { AddressService } from '../address.service';

describe('AddressController', () => {
  let controller: AddressController;
  let addressService: AddressService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: AddressService,
          useValue: {
            createAddress: jest.fn().mockResolvedValue(AddressData),
            findAddressByUserId: jest.fn().mockResolvedValue([AddressData]),
          },
        },
      ],
      controllers: [AddressController],
    }).compile();

    controller = module.get<AddressController>(AddressController);
    addressService = module.get<AddressService>(AddressService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(addressService).toBeDefined();
  });

  it('should address Entity in createAddress', async () => {
    const address = await controller.createAddress(
      CreateAddressData,
      UserEntityData.id,
    );

    expect(address).toEqual(AddressData);
  });

  it('should address Entity in findAddressByUserId', async () => {
    const addresses = await controller.findAddressByUserId(UserEntityData.id);

    expect(addresses).toEqual([
      {
        id: AddressData.id,
        complement: AddressData.complement,
        numberAddress: AddressData.numberAddress,
        cep: AddressData.cep,
      },
    ]);
  });
});
