import { PinsEntity } from './../../store/entities/pins.entity';
import { ProductEntity } from '../entities/product.entity';
import { ReturnProduct } from './../dtos/return-product.dto';
import { ProductController } from './../product.controller';
import { ProductService } from './../product.service';
import { Test, TestingModule } from '@nestjs/testing';

import { ResponseStorePdv } from 'src/store/dtos/response-store-pdv';
import { CreateProductDTO } from '../dtos/create-product.dto';

describe('ProductController', () => {
  let controller: ProductController;
  let service: ProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        {
          provide: ProductService,
          useValue: {
            findPriceDeliveryPdv: jest.fn(),
            findAll: jest.fn(),
            findProductById: jest.fn(),
            createProduct: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ProductController>(ProductController);
    service = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findPriceDeliverPdv', () => {
    it('should return delivery price data for a product', async () => {
      const mockPins: PinsEntity = {
        position: {
          lat: '40.7128',
          lng: '-74.0060',
        },
        title: 'Main Store',
      };

      const mockResponse: ResponseStorePdv[] = [
        {
          storeName: 'Store 1',
          nameProduct: 'Product 1',
          city: 'City 1',
          postalCode: '12345',
          type: 'Type 1',
          distance: '10km',
          value: [
            {
              prazo: '5 days',
              price: '100.00',
              description: 'Delivery price 1',
            },
            {
              prazo: '7 days',
              price: '120.00',
              description: 'Delivery price 2',
            },
          ],
          pins: mockPins,
        },
      ];

      jest
        .spyOn(service, 'findPriceDeliveryPdv')
        .mockResolvedValue(mockResponse);

      expect(await controller.findPriceDeliverPdv('12345')).toBe(mockResponse);
    });
  });

  describe('findAll', () => {
    it('should return an array of products', async () => {
      const mockProductEntities: ProductEntity[] = [
        new ProductEntity(),
        new ProductEntity(),
      ];

      mockProductEntities.forEach((product) => {
        product.storeId = 1;
        product.createdAt = new Date();
        product.updatedAt = new Date();
      });

      jest.spyOn(service, 'findAll').mockResolvedValue(mockProductEntities);

      const mockReturnProducts = mockProductEntities.map(
        (product) => new ReturnProduct(product),
      );

      expect(await controller.findAll()).toEqual(mockReturnProducts);
    });
  });

  describe('findProductById', () => {
    it('should return a product by id', async () => {
      const mockProductEntity = new ProductEntity();
      mockProductEntity.id = 1;
      mockProductEntity.name = 'Product 1';
      mockProductEntity.price = 100;
      mockProductEntity.image = 'image.jpg';
      mockProductEntity.length = '10';
      mockProductEntity.height = '5';
      mockProductEntity.width = '3';

      jest
        .spyOn(service, 'findProductById')
        .mockResolvedValue(mockProductEntity);

      const returnProduct = new ReturnProduct(mockProductEntity);

      expect(await controller.findProductById(1)).toEqual(returnProduct);
    });
  });

  describe('createProduct', () => {
    it('should create and return a new product', async () => {
      const mockCreateProductDto = new CreateProductDTO();
      const mockProduct = new ProductEntity();
      jest.spyOn(service, 'createProduct').mockResolvedValue(mockProduct);

      expect(await controller.createProduct(mockCreateProductDto)).toBe(
        mockProduct,
      );
    });
  });
});
