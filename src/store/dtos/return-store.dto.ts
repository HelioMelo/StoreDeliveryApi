import { ReturnAddressDTO } from './../../address/dto/returnAddress.dto';
import { ReturnProduct } from '../../product/dtos/return-product.dto';

import { StoreTypeEnum } from '../enum/store-type.enum';
import { StoreEntity } from '../entities/store.entity';

export class ReturnStore {
  id: number;
  store: string;
  email: string;
  phone: string;
  storeType?: StoreTypeEnum;
  amountProducts?: number;
  products?: ReturnProduct[];
  addresses?: ReturnAddressDTO[];

  constructor(storeEntity: StoreEntity, amountProducts?: number) {
    this.id = storeEntity.id;
    this.store = storeEntity.store;
    this.email = storeEntity.email;
    this.phone = storeEntity.phone;
    this.storeType = storeEntity.storeType;
    this.amountProducts = amountProducts;
    this.products = storeEntity.products
      ? storeEntity.products.map((product) => new ReturnProduct(product))
      : undefined;
    this.addresses = storeEntity.addresses
      ? storeEntity.addresses.map((address) => new ReturnAddressDTO(address))
      : undefined;
  }
}
