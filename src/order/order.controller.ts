import { UserId } from './../decorators/user-id-decorator';
import {
  Body,
  Controller,
  Get,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Roles } from '../decorators/roles.decorators';
import { UserType } from '../user/enum/user-type.enum';

import { OrderEntity } from './entities/order.entity';
import { OrderService } from './order.service';
import { CreateOrderDTO } from './dto/create-order.dto';

@Roles(UserType.Admin, UserType.Root, UserType.User)
@ApiTags('Order')
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @UsePipes(ValidationPipe)
  @ApiOperation({ summary: 'Create new order' })
  @ApiResponse({
    status: 201,
    description: 'Order created successfully',
    type: OrderEntity,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async createOrder(
    @Body() createOrderDTO: CreateOrderDTO,
    @UserId() userId: number,
  ): Promise<OrderEntity> {
    return this.orderService.createOrder(createOrderDTO, userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get orders by user ID' })
  @ApiResponse({
    status: 200,
    description: 'Successful response',
    type: [OrderEntity],
  })
  @ApiResponse({ status: 404, description: 'Orders not found' })
  async findOrdersUserId(@UserId() userId: number) {
    return this.orderService.findOrderByUserId(userId);
  }
}
