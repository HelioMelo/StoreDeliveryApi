import { InsertCartDTO } from './../dtos/insert-cart.dto';
import { ReturnCartDTO } from './../dtos/return-cart.dto';
import { Test, TestingModule } from '@nestjs/testing';
import { Response } from 'express';
import { CartController } from '../cart.controller';
import { CartService } from '../cart.service';

describe('CartController', () => {
  let controller: CartController;
  let service: CartService;

  beforeEach(async () => {
    const mockCartService = {
      insertProductInCart: jest.fn().mockResolvedValue(
        new ReturnCartDTO({
          id: 1,
          userId: 1,
          active: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          cartProduct: [],
        }),
      ),
      findCartByUserId: jest.fn().mockResolvedValue(
        new ReturnCartDTO({
          id: 1,
          userId: 1,
          active: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          cartProduct: [],
        }),
      ),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CartController],
      providers: [
        {
          provide: CartService,
          useValue: mockCartService,
        },
      ],
    }).compile();

    controller = module.get<CartController>(CartController);
    service = module.get<CartService>(CartService);
  });

  describe('createCart', () => {
    it('should create a new cart and return the cart DTO', async () => {
      const insertCartDto: InsertCartDTO = {
        productId: 123,
        amount: 2,
      };
      const userId = 1;

      const result = await controller.createCart(insertCartDto, userId);

      expect(result).toBeInstanceOf(ReturnCartDTO);
      expect(result.id).toEqual(1);
      expect(result.cartProduct).toEqual([]);
      expect(service.insertProductInCart).toHaveBeenCalledWith(
        insertCartDto,
        userId,
      );
    });
  });

  describe('findCartByUserId', () => {
    it('should return the cart when it exists', async () => {
      const userId = 1;

      const result = await controller.findCartByUserId(userId);

      expect(result).toBeInstanceOf(ReturnCartDTO);
      expect(result.id).toEqual(1);
      // Ajuste aqui para verificar que o método foi chamado com ambos os parâmetros: userId e true
      expect(service.findCartByUserId).toHaveBeenCalledWith(userId, true);
    });

    it('should return 204 if the cart does not exist', async () => {
      const userId = 2;

      const res: Response = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as any;

      // Mocking the service to return null for a user that doesn't have a cart
      (service.findCartByUserId as jest.Mock).mockResolvedValueOnce(null);

      await controller.findCartByUserId(userId, res);

      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });
  });
});
