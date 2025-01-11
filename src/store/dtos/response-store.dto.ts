import { PinsEntity } from '../entities/pins.entity';
import { StoreEntity } from '../entities/store.entity';
import { ValueEntity } from '../entities/value.entity';

export interface ResponseEntityDto
  extends Pick<StoreEntity, 'store' | 'products' | 'storeType'> {
  position: PinsEntity;
  value: ValueEntity[];
}
