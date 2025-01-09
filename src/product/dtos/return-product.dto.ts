import { ReturnStore } from 'src/store/dtos/return-store.dto';
import { ProductEntity } from '../entities/product.entity';

export class ReturnProduct {
  id: number;
  name: string;
  price: number;
  image: string;
  length: string;
  height: string;
  width: string;
  store?: ReturnStore;

  constructor(productEntity: ProductEntity) {
    this.id = productEntity.id;
    this.name = productEntity.name;
    this.price = productEntity.price;
    this.image = productEntity.image;
    this.length = productEntity.length;
    this.height = productEntity.height;
    this.width = productEntity.width;
    this.store = productEntity.store
      ? new ReturnStore(productEntity.store)
      : undefined;
  }
}
