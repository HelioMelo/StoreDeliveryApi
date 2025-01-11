import { OrderEntity } from './../entities/order.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus } from '@nestjs/common';
import { OrderController } from '../order.controller';
import { OrderService } from '../order.service';
import { CreateOrderDTO } from '../dto/create-order.dto';

describe('OrderController', () => {
  let controller: OrderController;
  let service: OrderService;

  beforeEach(async () => {
    const mockOrderService = {
      createOrder: jest.fn().mockResolvedValue({
        id: 1,
        addressId: 1,
        userId: 1,
        paymentId: 1,
        date: new Date(),
        amountPayments: 100.0,
        datePayment: new Date().toISOString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      } as OrderEntity),

      findOrderByUserId: jest.fn().mockResolvedValue([
        {
          id: 1,
          addressId: 1,
          userId: 1,
          paymentId: 1,
          date: new Date(),
          amountPayments: 100.0,
          datePayment: new Date().toISOString(),
          createdAt: new Date(),
          updatedAt: new Date(),
        } as OrderEntity,
      ]),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        {
          provide: OrderService,
          useValue: mockOrderService,
        },
      ],
    }).compile();

    controller = module.get<OrderController>(OrderController);
    service = module.get<OrderService>(OrderService);
  });

  it('should create a new order when valid parameters are passed', async () => {
    const createOrderDTO: CreateOrderDTO = {
      addressId: 1,
      date: new Date().toISOString(),
    };
    const userId = 1;

    const result = await controller.createOrder(createOrderDTO, userId);

    expect(result).toHaveProperty('id');
    expect(result.addressId).toBe(1);
    expect(service.createOrder).toHaveBeenCalledWith(createOrderDTO, userId);
  });

  it('should return an array of orders for a valid user ID', async () => {
    const userId = 1;

    const result = await controller.findOrdersUserId(userId);

    expect(result).toHaveLength(1);
    expect(result[0]).toHaveProperty('addressId', 1);
    expect(service.findOrderByUserId).toHaveBeenCalledWith(userId);
  });

  it('should return an error if no orders are found for a user', async () => {
    const userId = 999;

    service.findOrderByUserId = jest.fn().mockResolvedValue([]);
    try {
      await controller.findOrdersUserId(userId);
    } catch (error) {
      expect(error.status).toBe(HttpStatus.NOT_FOUND);
    }
  });
});
