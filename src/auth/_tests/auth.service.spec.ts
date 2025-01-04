import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';

import { UserService } from '../../user/user.service';

import { AuthService } from '../auth.service';
import { LoginUserData } from '../_testsData/login-user.data';

import { UserEntityData } from '../../user/testData/user.data';

import { jwtData } from '../_testsData/jwt.data';

describe('AuthService', () => {
  let service: AuthService;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            findUserByEmail: jest.fn().mockResolvedValue(UserEntityData),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: () => jwtData,
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(userService).toBeDefined();
  });

  it('should return error if password invalid and email valid', async () => {
    await expect(
      service.login({ ...LoginUserData, password: '4324' }),
    ).rejects.toThrow();
  });

  it('should return error if email not exist', async () => {
    jest.spyOn(userService, 'findUserByEmail').mockResolvedValue(undefined);

    await expect(service.login(LoginUserData)).rejects.toThrow();
  });

  it('should return error in UserService', async () => {
    jest.spyOn(userService, 'findUserByEmail').mockRejectedValue(new Error());

    await expect(service.login(LoginUserData)).rejects.toThrow();
  });
});
