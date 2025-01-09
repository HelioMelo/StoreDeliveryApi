import { AddressEntity } from '../../address/entities/address.entity';

export class ReturnAddressDTO {
  id: number;
  complement: string;
  numberAddress: string;
  cep: string;
  city: string;
  state: string;
  pin?: string;
  logradouro: string;
  latitude?: string;
  longitude?: string;
  distance?: string;

  constructor(address: AddressEntity) {
    this.id = address.id;
    this.complement = address.complement;
    this.numberAddress = address.numberAddress;
    this.cep = address.cep;
    this.city = address.city;
    this.state = address.state;
    this.logradouro = address.logradouro;
    this.pin = address.pin;

    this.distance = address.distance;
    this.latitude = address.latitude;
    this.longitude = address.longitude;
  }
}
