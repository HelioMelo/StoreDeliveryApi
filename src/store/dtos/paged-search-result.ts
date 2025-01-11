import { ReturnStore } from './return-store.dto';
import { StoreEntity } from '../entities/store.entity';

export interface PagedSearchResult {
  store?: ReturnStore[];
  stores?: StoreEntity[];
  offset: number;
  limit: number;
  count: number;
  total: number;
}
