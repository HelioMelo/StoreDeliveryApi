import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateProductDTO {
  @IsNumber()
  storeId: number;

  @IsString()
  name: string;

  @IsNumber()
  price: number;

  @IsString()
  image: string;

  @IsOptional()
  @IsNumber()
  length?: string;

  @IsOptional()
  @IsNumber()
  height?: string;

  @IsOptional()
  @IsNumber()
  width?: string;
}
