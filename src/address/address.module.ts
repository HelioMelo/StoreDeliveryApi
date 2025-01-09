import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { AddressController } from './address.controller';
import { AddressService } from './address.service';
import { AddressEntity } from './entities/address.entity';
import { UserModule } from 'src/user/user.module';
import { GoogleApiModule } from 'src/google-api/google-api.module'; // Importe o GoogleApiModule

@Module({
  imports: [
    TypeOrmModule.forFeature([AddressEntity]),
    UserModule,
    GoogleApiModule,
  ],
  controllers: [AddressController],
  providers: [AddressService],
  exports: [AddressService],
})
export class AddressModule {}
