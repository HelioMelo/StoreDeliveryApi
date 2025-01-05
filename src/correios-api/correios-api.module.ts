import { Module } from '@nestjs/common';
import { CorreiosApiService } from './correios-api.service';
import { CorreiosApiController } from './correios-api.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
  providers: [CorreiosApiService],
  controllers: [CorreiosApiController],
})
export class CorreiosApiModule {}
