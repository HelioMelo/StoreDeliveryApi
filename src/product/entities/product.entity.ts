import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CartProductEntity } from '../../cart-product/entities/cart-product.entity';
import { OrderProductEntity } from '../../order-product/entities/order-product.entity';
import { StoreEntity } from 'src/store/entities/store.entity';

@Entity({ name: 'product' })
export class ProductEntity {
  @PrimaryGeneratedColumn('rowid')
  id: number;

  @Column({ name: 'name', nullable: false })
  name: string;

  @Column({ name: 'store_id', nullable: false })
  storeId: number;

  @Column({ name: 'price', type: 'decimal', nullable: false })
  price: number;

  @Column({ name: 'image', nullable: false })
  image: string;

  @Column({ name: 'length', nullable: false })
  length: string;

  @Column({ name: 'height', nullable: false })
  height: string;

  @Column({ name: 'width', nullable: false })
  width: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => CartProductEntity, (cartProduct) => cartProduct.product)
  cartProduct?: CartProductEntity[];

  @ManyToOne(() => StoreEntity, (store: StoreEntity) => store.products)
  @JoinColumn({ name: 'store_id', referencedColumnName: 'id' })
  store?: StoreEntity;

  @OneToMany(() => OrderProductEntity, (orderProduct) => orderProduct.product)
  ordersProduct?: OrderProductEntity[];
}
