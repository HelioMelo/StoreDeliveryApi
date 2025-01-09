import { StoreService } from './../store/store.service';
import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreateProductDTO } from './dtos/create-product.dto';
import { ProductEntity } from './entities/product.entity';
import { CountProduct } from './dtos/count-product.dto';
import { CorreiosApiService } from '../correios-api/correios-api.service';
import { ProductCorreioDTO } from '../correios-api/dto/product.correio.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,

    @Inject(forwardRef(() => StoreService)) // Mudado para StoreService
    private readonly storeService: StoreService, // Mudado para storeService

    private readonly correiosApiService: CorreiosApiService,
  ) {}

  async findAll(
    productId?: number[],
    isFindRelations?: boolean,
  ): Promise<ProductEntity[]> {
    let findOptions = {};

    if (productId && productId.length > 0) {
      findOptions = {
        where: {
          id: In(productId),
        },
      };
    }

    if (isFindRelations) {
      findOptions = {
        ...findOptions,
        relations: {
          store: true, // Mudado para store
        },
      };
    }

    const products = await this.productRepository.find(findOptions);

    if (!products || products.length === 0) {
      throw new NotFoundException('Not found products');
    }

    return products;
  }

  async createProduct(createProduct: CreateProductDTO): Promise<ProductEntity> {
    await this.storeService.findStoreById(createProduct.storeId); // Mudado para storeService

    return this.productRepository.save({
      ...createProduct,
      width: createProduct.width || '0',
      length: createProduct.length || '0',
      height: createProduct.height || ' 0',
    });
  }

  async findProductById(
    productId: number,
    isRelations?: boolean,
  ): Promise<ProductEntity> {
    const relations = isRelations
      ? {
          store: true,
        }
      : undefined;

    const product = await this.productRepository.findOne({
      where: {
        id: productId,
      },
      relations,
    });

    if (!product) {
      throw new NotFoundException(`Product id: ${productId} not found`);
    }

    return product;
  }

  async countProductsByStoreId(): Promise<CountProduct[]> {
    // Mudado para Store
    return this.productRepository
      .createQueryBuilder('product')
      .select('product.store_id, COUNT(*) as total') // Mudado para store_id
      .groupBy('product.store_id') // Mudado para store_id
      .getRawMany();
  }

  async findPriceDelivery(cep: string, productId: number): Promise<any> {
    const product = await this.findProductById(productId);

    const productCorreioDTO = new ProductCorreioDTO(product);

    console.log(product);
    const returnCorreiosPrice = await this.correiosApiService.findPriceDeliver(
      cep,
      productCorreioDTO,
    );

    return returnCorreiosPrice;
  }
}
