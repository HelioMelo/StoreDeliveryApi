import { OrderEntity } from './../../order/entities/order.entity';
import { UserEntity } from '../../user/entities/user.entity';

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
import { StoreEntity } from '../../store/entities/store.entity';

@Entity({ name: 'address' })
export class AddressEntity {
  @PrimaryGeneratedColumn('rowid')
  id: number;

  @Column({ name: 'complement', nullable: true })
  complement?: string;

  @Column({ name: 'number' })
  numberAddress: string;

  @Column({ name: 'cep', nullable: false })
  cep: string;

  @Column({ name: 'city', nullable: false })
  city: string;

  @Column({ name: 'state', nullable: false })
  state: string;

  @Column({ name: 'logradouro', nullable: false })
  logradouro: string;

  @Column({ name: 'latitude', nullable: true })
  latitude?: string;

  @Column({ name: 'longitude', nullable: true })
  longitude?: string;

  @Column({ name: 'distance', nullable: true })
  distance?: string;

  @Column({ name: 'user_id', nullable: true })
  userId: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'store_id', nullable: true })
  storeId?: number;

  @ManyToOne(() => UserEntity, (user) => user.addresses)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user?: UserEntity;

  @ManyToOne(() => StoreEntity, (store) => store.addresses)
  @JoinColumn({ name: 'store_id', referencedColumnName: 'id' })
  store?: StoreEntity;

  @OneToMany(() => OrderEntity, (order) => order.address)
  orders?: OrderEntity[];
}
