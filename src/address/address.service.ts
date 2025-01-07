import { Injectable, NotFoundException } from '@nestjs/common';
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
  ) {}

  async createAddress(
    createAddressDTO: CreateAddressDTO,
    userId: number,
  ): Promise<AddressEntity> {
    await this.userService.findUserById(userId);
    return this.addressRepository.save({
      ...createAddressDTO,
      userId,
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
}
