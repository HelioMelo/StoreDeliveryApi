import { Module } from '@nestjs/common';
import { GoogleApiService } from './google-api.service';
import { GoogleApiController } from './google-api.controller';
import { Client as GoogleMapsClient } from '@googlemaps/google-maps-services-js';
import { DirectionsController } from './directions/directions.controller';
import { DirectionsService } from './directions/directions.service'; // Certifique-se de importar o serviço

@Module({
  providers: [
    GoogleApiService,
    DirectionsService,
    {
      provide: GoogleMapsClient,
      useValue: new GoogleMapsClient(),
    },
  ],
  controllers: [GoogleApiController, DirectionsController],
  exports: [GoogleApiService, GoogleApiService],
})
export class GoogleApiModule {}
