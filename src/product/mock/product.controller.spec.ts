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
      // Mock da entidade PinsEntity com a estrutura correta
      const mockPins: PinsEntity = {
        position: {
          lat: '40.7128',
          lng: '-74.0060',
        },
        title: 'Main Store',
      };

      // Mock do ResponseStorePdv
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
          pins: mockPins, // Adicionando a propriedade pins com a estrutura correta
        },
      ];

      // Mock do método findPriceDeliveryPdv no serviço
      jest
        .spyOn(service, 'findPriceDeliveryPdv')
        .mockResolvedValue(mockResponse);

      // Testando o método do controller
      expect(await controller.findPriceDeliverPdv('12345')).toBe(mockResponse);
    });
  });

  describe('findAll', () => {
    it('should return an array of products', async () => {
      // Mock de ProductEntity
      const mockProductEntities: ProductEntity[] = [
        new ProductEntity(),
        new ProductEntity(),
      ];

      // Adicionando valores fictícios para as propriedades necessárias de ProductEntity
      mockProductEntities.forEach((product) => {
        product.storeId = 1; // Definindo um valor numérico para storeId
        product.createdAt = new Date();
        product.updatedAt = new Date(); // Usando updatedAt em vez de updatedAtts
      });

      // Simulando que o serviço retorna uma lista de ProductEntity
      jest.spyOn(service, 'findAll').mockResolvedValue(mockProductEntities);

      // O controlador vai mapear ProductEntity para ReturnProduct
      const mockReturnProducts = mockProductEntities.map(
        (product) => new ReturnProduct(product),
      );

      // Verifique se o controlador retorna o DTO ReturnProduct
      expect(await controller.findAll()).toEqual(mockReturnProducts);
    });
  });

  describe('findProductById', () => {
    it('should return a product by id', async () => {
      // Mock da entidade ProductEntity
      const mockProductEntity = new ProductEntity();
      mockProductEntity.id = 1;
      mockProductEntity.name = 'Product 1';
      mockProductEntity.price = 100;
      mockProductEntity.image = 'image.jpg';
      mockProductEntity.length = '10';
      mockProductEntity.height = '5';
      mockProductEntity.width = '3';

      // Simulando que o serviço retorna uma instância de ProductEntity
      jest
        .spyOn(service, 'findProductById')
        .mockResolvedValue(mockProductEntity);

      // Chamando o controlador, que irá mapear ProductEntity para ReturnProduct
      const returnProduct = new ReturnProduct(mockProductEntity);

      // Verifique se o controlador retorna o DTO ReturnProduct
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
