import { Module } from '@nestjs/common';
import { GoogleApiService } from './google-api.service';
import { GoogleApiController } from './google-api.controller';
import { Client as GoogleMapsClient } from '@googlemaps/google-maps-services-js';
@Module({
  providers: [
    GoogleApiService,
    {
      provide: GoogleMapsClient,
      useValue: new GoogleMapsClient(),
    },
  ],
  controllers: [GoogleApiController],
})
export class GoogleApiModule {}
