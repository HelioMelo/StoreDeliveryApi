import { CorreiosApiModule } from './../correios-api/correios-api.module';
import { forwardRef, Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { CategoryModule } from '../category/category.module';

@Module({
  imports: [
    CorreiosApiModule,
    TypeOrmModule.forFeature([ProductEntity]),
    forwardRef(() => CategoryModule),
  ],
  providers: [ProductService],
  controllers: [ProductController],
  exports: [ProductService],
})
export class ProductModule {}
