import { CreateAddressDTO } from './../../address/dto/createAddress.dto';
import {
  IsArray,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { StoreTypeEnum } from '../enum/store-type.enum';

export class CreateStore {
  @IsString()
  store: string;

  @IsEmail()
  email: string;

  @IsString()
  phone: string;

  @IsOptional()
  @IsEnum(StoreTypeEnum)
  storeType?: StoreTypeEnum;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateAddressDTO)
  addresses: CreateAddressDTO[];
}
