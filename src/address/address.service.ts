import { GoogleApiService } from './../google-api/google-api.service';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { CreateAddressDTO } from './dto/createAddress.dto';
import { AddressEntity } from './entities/address.entity';
import { UserService } from './../user/user.service';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(AddressEntity)
    private readonly addressRepository: Repository<AddressEntity>,
    private readonly userService: UserService,
    private readonly googleApiService: GoogleApiService,
  ) {}

  async createAddress(
    createAddressDTO: CreateAddressDTO,
    userId: number,
  ): Promise<AddressEntity> {
    await this.userService.findUserById(userId);

    if (createAddressDTO.city && createAddressDTO.state) {
      const addressText = `${createAddressDTO.city}, ${createAddressDTO.state}, ${createAddressDTO.numberAddress}`;

      const googleResponse =
        await this.googleApiService.findPlaces(addressText);

      if (googleResponse.length === 0) {
        throw new BadRequestException('Invalid address provided');
      }

      const { lat, lng } = googleResponse[0].geometry.location;

      createAddressDTO.latitude = lat.toString();
      createAddressDTO.longitude = lng.toString();
    }

    return this.addressRepository.save({
      ...createAddressDTO,
      userId,
    });
  }

  async storeCreateAddress(
    createAddressDTO: CreateAddressDTO,
    storeId: number,
  ): Promise<AddressEntity> {
    await this.userService.findUserById(storeId);
    return this.addressRepository.save({
      ...createAddressDTO,
      storeId,
    });
  }
  async findAddressByUserId(userId: number): Promise<AddressEntity[]> {
    const addresses = await this.addressRepository.find({
      where: {
        userId,
      },
    });

    if (!addresses || addresses.length === 0) {
      throw new NotFoundException(`Address not found for userId: ${userId}`);
    }

    return addresses;
  }

  async findAddressByStoreId(storeId: number): Promise<AddressEntity[]> {
    const addresses = await this.addressRepository.find({
      where: {
        storeId,
      },
    });

    if (!addresses || addresses.length === 0) {
      throw new NotFoundException(`Address not found for storId: ${storeId}`);
    }

    return addresses;
  }

  async findCityByName(
    nameCity: string,
    nameState: string,
  ): Promise<AddressEntity> {
    const address = await this.addressRepository.findOne({
      where: {
        city: ILike(nameCity),
        state: ILike(nameState),
      },
    });

    if (!address) {
      throw new NotFoundException(
        `Address not found for city "${nameCity}" and state "${nameState}"`,
      );
    }

    return address;
  }

  async processAddress(
    createAddressDto: CreateAddressDTO,
  ): Promise<AddressEntity> {
    const address = new AddressEntity();
    address.logradouro = createAddressDto.logradouro;
    address.city = createAddressDto.city;
    address.state = createAddressDto.state;
    address.numberAddress = createAddressDto.numberAddress;

    const addressText =
      address.logradouro +
      ', ' +
      address.city +
      ', ' +
      address.state +
      ', ' +
      address.numberAddress;

    const googleResponse = await this.googleApiService.findPlaces(addressText);

    if (googleResponse.length === 0) {
      throw new BadRequestException(
        `Invalid address for ${address.city}, ${address.state}`,
      );
    }

    const { lat, lng } = googleResponse[0].geometry.location;

    address.latitude = lat.toString();
    address.longitude = lng.toString();

    if (!createAddressDto.cep) {
      address.cep = '';
    } else {
      address.cep = createAddressDto.cep;
    }

    return address;
  }
}
