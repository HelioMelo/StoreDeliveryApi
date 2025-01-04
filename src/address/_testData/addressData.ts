import { UserEntityData } from '../../user/testData/user.data';

import { AddressEntity } from '../entities/address.entity';

export const AddressData: AddressEntity = {
  cep: '43253252',
  city: 'João Pessoa',
  complement: 'llkdfja',
  createdAt: new Date(),
  id: 57546,
  numberAddress: '654',
  updatedAt: new Date(),
  state: 'PB',
  userId: UserEntityData.id,
};
