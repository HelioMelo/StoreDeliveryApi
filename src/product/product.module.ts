import { StoreModule } from './../store/store.module';
import { CorreiosApiModule } from './../correios-api/correios-api.module';
import { forwardRef, Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';

@Module({
  imports: [
    CorreiosApiModule,
    TypeOrmModule.forFeature([ProductEntity]),
    forwardRef(() => StoreModule),
  ],
  providers: [ProductService],
  controllers: [ProductController],
  exports: [ProductService],
})
export class ProductModule {}
