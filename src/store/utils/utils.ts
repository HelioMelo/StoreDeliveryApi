import { AddressEntity } from 'src/address/entities/address.entity';
import { StoreEntity } from 'src/store/entities/store.entity';
import { BadRequestException } from '@nestjs/common';
import { getDistance } from 'geolib';
import { GoogleApiService } from 'src/google-api/google-api.service';
import { StoreTypeEnum } from '../enum/store-type.enum';

// Utilitário para lidar com distâncias e validações
export class Utils {
  // Formatar o endereço para a API do Google
  static formatAddressForGoogle(address: AddressEntity): string {
    return `${address.logradouro}, ${address.city}, ${address.state}, ${address.numberAddress}`;
  }

  // Obter as coordenadas de um endereço usando a API do Google
  static async getCoordinatesFromGoogle(
    googleApiService: GoogleApiService,
    addressText: string,
  ): Promise<{ latitude: string; longitude: string }> {
    const googleResponse = await googleApiService.findPlaces(addressText);
    if (googleResponse.length === 0) {
      throw new BadRequestException(`Invalid address: ${addressText}`);
    }
    const { lat, lng } = googleResponse[0].geometry.location;
    return { latitude: lat.toString(), longitude: lng.toString() };
  }

  // Calcular a distância entre dois pontos (em km)
  static calculateDistance(
    origin: { latitude: number; longitude: number },
    destination: { latitude: number; longitude: number },
  ): string {
    const distanceInMeters = getDistance(origin, destination);
    return (distanceInMeters / 1000).toFixed(2); // Retorna em quilômetros como string
  }

  // Filtrar endereços por distância máxima
  static filterAddressesByDistance(
    addresses: AddressEntity[],
    maxDistance: number,
  ): AddressEntity[] {
    return addresses.filter((address) => {
      const distance = parseFloat(address.distance || '0');
      return distance <= maxDistance;
    });
  }

  // Verificar se há endereços dentro de uma distância específica
  static hasAddressWithinDistance(
    addresses: AddressEntity[],
    maxDistance: number,
  ): boolean {
    return addresses.some((address) => {
      const distance = parseFloat(address.distance || '0');
      return distance <= maxDistance;
    });
  }

  // Aplicar regras para lojas ou PDVs com base na distância
  static applyStoreRules(address: AddressEntity, store: StoreEntity): boolean {
    if (!address.distance) return false;

    const distance = parseFloat(address.distance);

    if (store.storeType === StoreTypeEnum.LOJA) {
      return true; // Loja sempre listada
    }

    if (store.storeType === StoreTypeEnum.PDV) {
      return distance <= 50; // PDV apenas até 50 km
    }

    return false;
  }
}
