import { UserId } from './../decorators/user-id-decorator';
import {
  Body,
  Controller,
  Get,
  Post,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Roles } from '../decorators/roles.decorators';
import { UserType } from '../user/enum/user-type.enum';
import { CartService } from './cart.service';
import { InsertCartDTO } from './dtos/insert-cart.dto';
import { ReturnCartDTO } from './dtos/return-cart.dto';
import { Response } from 'express';

@Roles(UserType.User, UserType.Admin, UserType.Root)
@ApiTags('Cart')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @UsePipes(ValidationPipe)
  @Post()
  @ApiOperation({ summary: 'Create new cart' })
  @ApiResponse({
    status: 201,
    description: 'Cart created successfully',
    type: ReturnCartDTO,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async createCart(
    @Body() insertCart: InsertCartDTO,
    @UserId() userId: number,
  ): Promise<ReturnCartDTO> {
    return new ReturnCartDTO(
      await this.cartService.insertProductInCart(insertCart, userId),
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get cart by user ID' })
  @ApiResponse({
    status: 200,
    description: 'Successful response',
    type: ReturnCartDTO,
  })
  @ApiResponse({ status: 204, description: 'No content' })
  @ApiResponse({ status: 404, description: 'Cart not found' })
  async findCartByUserId(
    @UserId() userId: number,
    @Res({ passthrough: true }) res?: Response,
  ): Promise<ReturnCartDTO> {
    const cart = await this.cartService
      .findCartByUserId(userId, true)
      .catch(() => undefined);

    if (cart) {
      return cart;
    }

    res.status(204).send();

    return;
  }
}
