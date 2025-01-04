import { UserEntityData } from './../../user/testData/user.data';

import { LoginDTO } from '../dto/login.dto';

export const LoginUserData: LoginDTO = {
  email: UserEntityData.email,
  password: '11111111',
};
