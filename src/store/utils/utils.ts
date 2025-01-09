import { AddressEntity } from 'src/address/entities/address.entity';
import { StoreEntity } from 'src/store/entities/store.entity';
import { BadRequestException } from '@nestjs/common';
import { getDistance } from 'geolib';
import { GoogleApiService } from 'src/google-api/google-api.service';
import { StoreTypeEnum } from '../enum/store-type.enum';

// Função para formatar o endereço para a API do Google
export function formatAddressForGoogle(address: AddressEntity): string {
  return `${address.logradouro}, ${address.city}, ${address.state}, ${address.numberAddress}`;
}

// Função para obter as coordenadas de um endereço usando a API do Google
export async function getCoordinatesFromGoogle(
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

// Função para calcular a distância entre dois pontos (em km)
export function calculateDistance(
  from: { latitude: number; longitude: number },
  to: { latitude: number; longitude: number },
): number {
  return getDistance(from, to) / 1000;
}

// Função para aplicar as regras de loja ou PDV com base na distância
export function applyStoreRules(
  address: AddressEntity,
  store: StoreEntity,
): boolean {
  const distance = parseFloat(address.distance);
  switch (store.storeType) {
    case StoreTypeEnum.LOJA:
      if (distance < 50) return true;
      if (distance >= 50) return true;
    case StoreTypeEnum.PDV:
      if (distance <= 50) return true;
      if (distance >= 50) return false;
  }
  return false;
}
