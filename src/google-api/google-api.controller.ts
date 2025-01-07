import { Controller, Get, Query } from '@nestjs/common';
import { GoogleApiService } from './google-api.service';

@Controller('google-api')
export class GoogleApiController {
  constructor(private readonly googleApiService: GoogleApiService) {}
  @Get()
  findPlaces(@Query('text') text: string) {
    return this.googleApiService.findPlaces(text);
  }
}
