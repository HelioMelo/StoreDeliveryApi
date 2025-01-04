import { IsString, IsOptional } from 'class-validator';

export class CreateAddressDTO {
  @IsString()
  @IsOptional()
  complement: string;

  @IsString()
  numberAddress: string;

  @IsString()
  cep: string;

  @IsString()
  city: string;
}
