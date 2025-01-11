import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { GoogleApiService } from './google-api.service';

@Controller('google-api')
@ApiTags('Google API')
export class GoogleApiController {
  constructor(private readonly googleApiService: GoogleApiService) {}

  @Get()
  @ApiOperation({ summary: 'Find places using Google API' })
  @ApiQuery({
    name: 'text',
    description: 'The text to search for places',
    required: true,
  })
  @ApiResponse({ status: 200, description: 'Successful response' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  findPlaces(@Query('text') text: string) {
    return this.googleApiService.findPlaces(text);
  }
}
