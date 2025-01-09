import { GoogleApiModule } from './../google-api/google-api.module';
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoreService } from './store.service';
import { StoreController } from './store.controller';
import { StoreEntity } from './entities/store.entity';
import { AddressEntity } from '../address/entities/address.entity'; // Importando o AddressEntity
import { ProductModule } from '../product/product.module';
import { AddressModule } from '../address/address.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([StoreEntity, AddressEntity]),
    GoogleApiModule,
    forwardRef(() => ProductModule),
    AddressModule,
  ],
  providers: [StoreService],
  controllers: [StoreController],
  exports: [StoreService],
})
export class StoreModule {}
