import { AddressEntity } from '../../address/entities/address.entity';
import { ProductEntity } from '../../product/entities/product.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { StoreTypeEnum } from '../enum/store-type.enum';

@Entity({ name: 'store' })
export class StoreEntity {
  // A classe precisa ser exportada corretamente
  @PrimaryGeneratedColumn('rowid')
  id: number;

  @Column({ name: 'store', nullable: false })
  store: string;

  @Column({ name: 'email', nullable: false })
  email: string;

  @Column({ name: 'phone', nullable: true })
  phone: string;

  @Column({ nullable: true })
  pin?: string;

  @Column({ name: 'storeType', nullable: true })
  storeType?: StoreTypeEnum;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => ProductEntity, (product) => product.store, { cascade: true })
  products: ProductEntity[];

  @OneToMany(() => AddressEntity, (address) => address.store, { cascade: true })
  addresses: AddressEntity[];
}
