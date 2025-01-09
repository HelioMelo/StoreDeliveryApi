import { CreateAddressDTO } from '../dto/createAddress.dto';

import { AddressData } from './addressData';

export const CreateAddressData: CreateAddressDTO = {
  cep: AddressData.cep,
  complement: AddressData.complement,
  numberAddress: AddressData.numberAddress,
  city: AddressData.city,
  state: AddressData.state,
  logradouro: AddressData.logradouro,
};
