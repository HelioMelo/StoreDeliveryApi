import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { Roles } from '../decorators/roles.decorators';
import { UserType } from '../user/enum/user-type.enum';
import { CreateProductDTO } from './dtos/create-product.dto';

import { ReturnProduct } from './dtos/return-product.dto';
import { ProductEntity } from './entities/product.entity';
import { ProductService } from './product.service';
import { ResponseStorePdv } from 'src/store/dtos/response-store-pdv';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // @Get('/:idProduct/delivery/:cep')
  // async findPriceDeliver(
  //   @Param('idProduct') idProduct: number,
  //   @Param('cep') cep: string,
  // ): Promise<any> {
  //   return this.productService.findPriceDelivery(cep, idProduct);
  // }

  @Get('/delivery/:cep')
  async findPriceDeliverPdv(
    @Param('cep') cep: string,
  ): Promise<ResponseStorePdv[]> {
    return this.productService.findPriceDeliveryPdv(cep);
  }

  @Roles(UserType.Admin, UserType.Root, UserType.User)
  @Get()
  async findAll(): Promise<ReturnProduct[]> {
    return (await this.productService.findAll([], true)).map(
      (product) => new ReturnProduct(product),
    );
  }

  @Get('/:productId')
  async findProductById(@Param('productId') productId): Promise<ReturnProduct> {
    return new ReturnProduct(
      await this.productService.findProductById(productId),
    );
  }

  @Roles(UserType.Admin, UserType.Root)
  @UsePipes(ValidationPipe)
  @Post()
  async createProduct(
    @Body() createProduct: CreateProductDTO,
  ): Promise<ProductEntity> {
    return this.productService.createProduct(createProduct);
  }
}
