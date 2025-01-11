import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateAddressDTO {
  @IsString()
  numberAddress: string;

  @IsString()
  cep: string;

  @IsString()
  logradouro: string;

  @IsString()
  city: string;

  @IsString()
  state: string;

  @IsOptional()
  @IsNumber()
  latitude?: string;

  @IsOptional()
  @IsNumber()
  longitude?: string;

  @IsOptional()
  @IsString()
  complement?: string;
}
