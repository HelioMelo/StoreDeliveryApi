import { UserId } from './../decorators/user-id-decorator';
import {
  Body,
  Controller,
  Get,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Roles } from '../decorators/roles.decorators';
import { UserType } from '../user/enum/user-type.enum';

import { OrderEntity } from './entities/order.entity';
import { OrderService } from './order.service';
import { CreateOrderDTO } from './dto/create-order.dto';

@Roles(UserType.Admin, UserType.Root, UserType.User)
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async createOrder(
    @Body() createOrderDTO: CreateOrderDTO,
    @UserId() userId: number,
  ): Promise<OrderEntity> {
    return this.orderService.createOrder(createOrderDTO, userId);
  }

  @Get()
  async findOrdersUserId(@UserId() userId: number) {
    return this.orderService.findOrderByUserId(userId);
  }
}
