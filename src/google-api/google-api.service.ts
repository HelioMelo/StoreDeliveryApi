import { BadRequestException, Injectable } from '@nestjs/common';
import {
  Client as GoogleMapsClient,
  PlaceInputType,
} from '@googlemaps/google-maps-services-js';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class GoogleApiService {
  constructor(
    private googleMapsClient: GoogleMapsClient,
    private configService: ConfigService,
  ) {}

  async findPlaces(text: string) {
    const { data } = await this.googleMapsClient.findPlaceFromText({
      params: {
        input: text,
        inputtype: PlaceInputType.textQuery,
        fields: ['place_id', 'formatted_address', 'geometry', 'name'],
        key: this.configService.get('GOOGLE_MAPS_API_KEY'),
      },
    });

    return data.candidates;
  }

  async getCoordinatesByCep(
    cep: string,
  ): Promise<{ latitude: number; longitude: number }> {
    try {
      const formattedCep = cep.replace(/[-\s]/g, '');

      const googleMapsApiKey = this.configService.get('GOOGLE_MAPS_API_KEY');

      const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${formattedCep}&key=${googleMapsApiKey}`;

      const response = await axios.get(geocodeUrl);

      if (response.data.status === 'OK') {
        const location = response.data.results[0].geometry.location;
        return {
          latitude: location.lat,
          longitude: location.lng,
        };
      } else {
        throw new BadRequestException(`Invalid address for CEP: ${cep}`);
      }
    } catch (error) {
      console.error('Error fetching coordinates from Google API:', error);
      throw new BadRequestException(
        'Error fetching coordinates from Google API',
      );
    }
  }
}
