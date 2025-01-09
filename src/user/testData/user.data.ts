import { UserEntity } from '../entities/user.entity';
import { UserType } from '../enum/user-type.enum';

export const UserEntityData: UserEntity = {
  cpf: '123543543',
  createdAt: new Date(),
  email: 'emailmock@emali.com',
  id: 43242,
  name: 'nameMock',
  password: '$2b$10$S62WmVpIxL52Z.0y22DWfuaAz8.XUNESChWP.AlMFZnOJ9n9uiqi.',
  phone: '321532523532',
  typeUser: UserType.User,
  updatedAt: new Date(),
  addresses: [
    {
      id: 1,
      logradouro: 'Rua Exemplo',
      numberAddress: '101',
      city: 'Cidade Exemplo',
      state: 'Estado Exemplo',
      complement: 'Apto 101',
      cep: '12345-678',
      userId: 43242, // Adicionado userId relacionado ao usuário
      createdAt: new Date(), // Data de criação
      updatedAt: new Date(), // Data de atualização
    },
  ],
};
