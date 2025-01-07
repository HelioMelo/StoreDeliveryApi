import { AddressModule } from './../address/address.module';
import { Module } from '@nestjs/common';
import { CorreiosApiService } from './correios-api.service';
import { CorreiosApiController } from './correios-api.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule.register({
      timeout: 500000,
      maxRedirects: 5,
    }),
    AddressModule,
  ],
  providers: [CorreiosApiService],
  controllers: [CorreiosApiController],
  exports: [CorreiosApiService],
})
export class CorreiosApiModule {}
