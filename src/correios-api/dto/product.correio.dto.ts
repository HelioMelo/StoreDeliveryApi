import { ProductEntity } from '../../product/entities/product.entity';

export class ProductCorreioDTO {
  length: string;
  width: string;
  height: string;

  constructor(product: ProductEntity) {
    this.length = product.length.toString();
    this.width = product.width.toString();
    this.height = product.height.toString();
  }
}
