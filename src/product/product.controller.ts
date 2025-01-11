import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { Roles } from '../decorators/roles.decorators';
import { UserType } from '../user/enum/user-type.enum';
import { CreateProductDTO } from './dtos/create-product.dto';
import { ReturnProduct } from './dtos/return-product.dto';
import { ProductEntity } from './entities/product.entity';
import { ProductService } from './product.service';
import { ResponseStorePdv } from 'src/store/dtos/response-store-pdv';

@ApiTags('Products')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ApiOperation({ summary: 'Buscar preços de entrega para um produto' })
  @ApiResponse({
    status: 200,
    description: 'Preços de entrega encontrados com sucesso',
  })
  @Get('/delivery/:cep')
  async findPriceDeliverPdv(
    @Param('cep') cep: string,
  ): Promise<ResponseStorePdv[]> {
    return this.productService.findPriceDeliveryPdv(cep);
  }

  @Roles(UserType.Admin, UserType.Root, UserType.User)
  @ApiOperation({ summary: 'Listar todos os produtos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de produtos retornada com sucesso',
    type: [ReturnProduct],
  })
  @Get()
  async findAll(): Promise<ReturnProduct[]> {
    return (await this.productService.findAll([], true)).map(
      (product) => new ReturnProduct(product),
    );
  }

  @ApiOperation({ summary: 'Buscar produto por ID' })
  @ApiResponse({
    status: 200,
    description: 'Produto encontrado com sucesso',
    type: ReturnProduct,
  })
  @ApiResponse({
    status: 404,
    description: 'Produto não encontrado',
  })
  @Get('/:productId')
  async findProductById(@Param('productId') productId): Promise<ReturnProduct> {
    return new ReturnProduct(
      await this.productService.findProductById(productId),
    );
  }

  @Roles(UserType.Admin, UserType.Root)
  @UsePipes(ValidationPipe)
  @ApiOperation({ summary: 'Criar um novo produto' })
  @ApiResponse({
    status: 201,
    description: 'Produto criado com sucesso',
    type: ProductEntity,
  })
  @ApiResponse({
    status: 400,
    description: 'Erro na validação dos dados fornecidos',
  })
  @Post()
  async createProduct(
    @Body() createProduct: CreateProductDTO,
  ): Promise<ProductEntity> {
    return this.productService.createProduct(createProduct);
  }
}
