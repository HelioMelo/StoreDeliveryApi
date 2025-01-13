import { PinsEntity } from './../store/entities/pins.entity';
// import { ResponseEntityDto } from './../store/dtos/response-store.dto';
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
import { CorreiosApiService } from '../correios-api/correios-api.service';
import { ProductCorreioDTO } from '../correios-api/dto/product.correio.dto';
import {
  ResponseStorePdv,
  ResponseValue,
} from '../store/dtos/response-store-pdv';
import { Utils } from '../store/utils/utils';
import { GoogleApiService } from '../google-api/google-api.service';
import { ResponsePriceCorreiosDTO } from './../correios-api/dto/response-price-correios.dto';
import { AddressEntity } from 'src/address/entities/address.entity';
import { StoreTypeEnum } from 'src/store/enum/store-type.enum';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    @Inject(forwardRef(() => StoreService))
    private readonly storeService: StoreService,
    private readonly correiosApiService: CorreiosApiService,
    private readonly googleApiService: GoogleApiService,
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
          store: true,
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
    await this.storeService.findStoreById(createProduct.storeId);

    return this.productRepository.save({
      ...createProduct,
      width: createProduct.width || '0',
      length: createProduct.length || '0',
      height: createProduct.height || ' 0',
    });
  }

  async findProductById(productId: number): Promise<ProductEntity> {
    const product = await this.productRepository.findOne({
      where: {
        id: productId,
      },
      relations: ['store', 'store.addresses'],
    });

    if (!product) {
      throw new NotFoundException(`Product id: ${productId} not found`);
    }

    return product;
  }

  // async countProductsByStoreId(): Promise<CountProduct[]> {
  //   // Mudado para Store
  //   return this.productRepository
  //     .createQueryBuilder('product')
  //     .select('product.store_id, COUNT(*) as total') // Mudado para store_id
  //     .groupBy('product.store_id') // Mudado para store_id
  //     .getRawMany();
  // }

  async findPriceDeliveryPdv(cep: string): Promise<ResponseStorePdv[]> {
    const products = await this.productRepository.find({
      relations: ['store', 'store.addresses'],
    });

    const { latitude, longitude } =
      await this.googleApiService.getCoordinatesByCep(cep);

    const nearbyStores: ResponseStorePdv[] = [];
    const distantStores: ResponseStorePdv[] = [];

    for (const product of products) {
      const productCorreioDTO = new ProductCorreioDTO(product);

    console.log(product);
    const returnCorreiosPrice = await this.correiosApiService.findPriceDeliver(
      cep,
      productCorreioDTO,
    );

    return returnCorreiosPrice;
  }
}
