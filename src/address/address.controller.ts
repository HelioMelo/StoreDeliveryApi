import {
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
  Body,
  Get,
  Param,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { CreateAddressDTO } from './dto/createAddress.dto';
import { AddressService } from './address.service';
import { AddressEntity } from './entities/address.entity';
import { Roles } from '../decorators/roles.decorators';
import { UserType } from '../user/enum/user-type.enum';
import { UserId } from '../decorators/user-id-decorator';
import { ReturnAddressDTO } from './dto/returnAddress.dto';

@Controller('address')
@ApiTags('Address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Roles(UserType.User)
  @Post()
  @UsePipes(ValidationPipe)
  @ApiOperation({ summary: 'Create new address' })
  @ApiBody({ type: CreateAddressDTO })
  @ApiResponse({
    status: 201,
    description: 'Address created successfully',
    type: AddressEntity,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async createAddress(
    @Body() createAddressDTO: CreateAddressDTO,
    @UserId() userId: number,
  ): Promise<AddressEntity> {
    return this.addressService.createAddress(createAddressDTO, userId);
  }

  @Roles(UserType.User)
  @Get()
  @ApiOperation({ summary: 'Get addresses by user ID' })
  @ApiResponse({
    status: 200,
    description: 'Successful response',
    type: [ReturnAddressDTO],
  })
  @ApiResponse({ status: 404, description: 'Addresses not found' })
  async findAddressByUserId(
    @UserId() userId: number,
  ): Promise<ReturnAddressDTO[]> {
    return (await this.addressService.findAddressByUserId(userId)).map(
      (address) => new ReturnAddressDTO(address),
    );
  }

  @Post(':storeId/store')
  @UsePipes(ValidationPipe)
  @ApiOperation({ summary: 'Create new store address' })
  @ApiBody({ type: CreateAddressDTO })
  @ApiParam({ name: 'storeId', description: 'ID of the store', required: true })
  @ApiResponse({
    status: 201,
    description: 'Address created successfully',
    type: AddressEntity,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async createAddressStore(
    @Body() createAddressDTO: CreateAddressDTO,
    @Param('storeId') storeId: number,
  ): Promise<AddressEntity> {
    return this.addressService.storeCreateAddress(createAddressDTO, storeId);
  }

  @Get(':storeId')
  @ApiOperation({ summary: 'Get addresses by store ID' })
  @ApiParam({ name: 'storeId', description: 'ID of the store', required: true })
  @ApiResponse({
    status: 200,
    description: 'Successful response',
    type: [ReturnAddressDTO],
  })
  @ApiResponse({ status: 404, description: 'Addresses not found' })
  async findAddressByStoreId(
    @Param('storeId') storeId: number,
  ): Promise<ReturnAddressDTO[]> {
    return (await this.addressService.findAddressByStoreId(storeId)).map(
      (address) => new ReturnAddressDTO(address),
    );
  }
}
