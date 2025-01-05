import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateOrderDTO {
  @IsOptional()
  @IsDateString()
  date?: string;

  @IsNumber()
  addressId: number;

  @IsOptional()
  @IsNumber()
  amountPayments?: number;

  @IsOptional()
  @IsString()
  datePayment?: string;
}
