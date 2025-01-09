import {
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
  Body,
  Get,
  Param,
} from '@nestjs/common';
import { CreateAddressDTO } from './dto/createAddress.dto';
import { AddressService } from './address.service';
import { AddressEntity } from './entities/address.entity';

import { Roles } from '../decorators/roles.decorators';

import { UserType } from '../user/enum/user-type.enum';

import { UserId } from '../decorators/user-id-decorator';
import { ReturnAddressDTO } from './dto/returnAddress.dto';

@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Roles(UserType.User)
  @Post()
  @UsePipes(ValidationPipe)
  async createAddress(
    @Body() createAddressDTO: CreateAddressDTO,
    @UserId() userId: number,
  ): Promise<AddressEntity> {
    return this.addressService.createAddress(createAddressDTO, userId);
  }

  @Roles(UserType.User)
  @Get()
  async findAddressByUserId(
    @UserId() userId: number,
  ): Promise<ReturnAddressDTO[]> {
    return (await this.addressService.findAddressByUserId(userId)).map(
      (address) => new ReturnAddressDTO(address),
    );
  }

  @Post(':storeId/store')
  @UsePipes(ValidationPipe)
  async createAddressStore(
    @Body() createAddressDTO: CreateAddressDTO,
    @Param('storeId') storeId: number,
  ): Promise<AddressEntity> {
    return this.addressService.storeCreateAddress(createAddressDTO, storeId);
  }

  @Get(':storeId')
  async findAddressByStoreId(
    @Param('storeId') storeId: number,
  ): Promise<ReturnAddressDTO[]> {
    return (await this.addressService.findAddressByStoreId(storeId)).map(
      (address) => new ReturnAddressDTO(address),
    );
  }
}
