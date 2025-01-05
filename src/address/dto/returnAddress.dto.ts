import { AddressEntity } from '../../address/entities/address.entity';

export class ReturnAddressDTO {
  id: number;
  complement: string;
  numberAddress: string;
  cep: string;
  city: string;
  state: string;

  constructor(address: AddressEntity) {
    this.id = address.id;
    this.complement = address.complement;
    this.numberAddress = address.numberAddress;
    this.cep = address.cep;
    this.city = address.city;
    this.state = address.state;
  }
}
