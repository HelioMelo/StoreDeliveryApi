import { GoogleApiService } from './../../google-api/google-api.service';
import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { AddressService } from '../address.service';
import { AddressEntity } from '../entities/address.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserService } from '../../user/user.service';

describe('AddressService', () => {
  let service: AddressService;
  let addressRepository: Repository<AddressEntity>;
  let googleApiService: GoogleApiService;
  let userService: UserService;

  beforeEach(async () => {
    // Mock GoogleApiService
    const mockGoogleApiService = {
      findPlaces: async (text: string) => {
        if (text === 'Invalid City') {
          return [];
        } else {
          return [{ geometry: { location: { lat: 123.45, lng: 678.9 } } }];
        }
      },
    };

    const mockUserService = {
      findUserById: jest.fn().mockResolvedValue({ id: 1, name: 'Test User' }),
    };

    const mockAddressRepository = {
      save: jest.fn().mockResolvedValue({
        id: 1,
        logradouro: 'Rua X',
        city: 'City Y',
        state: 'State Z',
        numberAddress: '123',
        latitude: '123.45',
        longitude: '678.90',
        cep: '12345-678',
      }),
      find: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AddressService,
        {
          provide: getRepositoryToken(AddressEntity),
          useValue: mockAddressRepository,
        },
        {
          provide: GoogleApiService,
          useValue: mockGoogleApiService,
        },
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    service = module.get<AddressService>(AddressService);
    addressRepository = module.get<Repository<AddressEntity>>(
      getRepositoryToken(AddressEntity),
    );
    googleApiService = module.get<GoogleApiService>(GoogleApiService);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createAddress', () => {
    it('should create an address with valid data', async () => {
      const createAddressDTO = {
        logradouro: 'Rua X',
        city: 'City Y',
        state: 'State Z',
        numberAddress: '123',
        latitude: '123.45',
        longitude: '678.90',
        cep: '12345-678',
      };

      const result = await service.createAddress(createAddressDTO, 1);
      expect(result).toHaveProperty('city', 'City Y');
      expect(result).toHaveProperty('latitude', '123.45');
      expect(result).toHaveProperty('longitude', '678.90');
    });
  });

  describe('findAddressByUserId', () => {
    it('should return addresses for a user', async () => {
      const mockAddress = new AddressEntity();
      mockAddress.city = 'City Y';

      jest.spyOn(addressRepository, 'find').mockResolvedValue([mockAddress]);

      const result = await service.findAddressByUserId(1);
      expect(result).toHaveLength(1);
      expect(result[0].city).toBe('City Y');
    });

    it('should throw NotFoundException if no address is found', async () => {
      jest.spyOn(addressRepository, 'find').mockResolvedValue([]);

      await expect(service.findAddressByUserId(1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('integration with UserService and GoogleApiService', () => {
    it('should use the GoogleApiService to find places', async () => {
      const location = await googleApiService.findPlaces('City Y');
      expect(location).toHaveLength(1);
      expect(location[0].geometry.location.lat).toBe(123.45);
      expect(location[0].geometry.location.lng).toBe(678.9);
    });

    it('should use the UserService to find a user by ID', async () => {
      const user = await userService.findUserById(1);
      expect(user).toHaveProperty('id', 1);
      expect(user).toHaveProperty('name', 'Test User');
    });
  });
});
