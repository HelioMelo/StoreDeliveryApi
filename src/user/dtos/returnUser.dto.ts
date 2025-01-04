import { ReturnAddressDTO } from '../../address/dto/returnAddress.dto';
import { UserEntity } from '../entities/user.entity';

export class ReturnUserDTO {
  id: number;
  name: string;
  email: string;
  phone: string;
  cpf: string;
  addresses?: ReturnAddressDTO[];

  constructor(userEntity: UserEntity) {
    this.id = userEntity.id;
    this.name = userEntity.name;
    this.email = userEntity.email;
    this.phone = userEntity.phone;
    this.cpf = userEntity.cpf;

    this.addresses = userEntity.addresses
      ? userEntity.addresses.map((address) => new ReturnAddressDTO(address))
      : undefined;
  }
}
