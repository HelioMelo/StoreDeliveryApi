import {
  IsEmail,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { UserType } from '../enum/user-type.enum';

export class CreateUserDTO {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  phone: string;

  @IsString()
  cpf: string;

  @IsString()
  @Length(8, 20)
  password: string;

  @IsOptional()
  @IsInt()
  @IsEnum(UserType)
  userType?: UserType;
}
