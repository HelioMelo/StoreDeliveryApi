import { ReturnLoginDTO } from './../dto/returnLogin.dto';
import { LoginDTO } from './../dto/login.dto';
import { Test, TestingModule } from '@nestjs/testing';

import { ReturnUserDTO } from 'src/user/dtos/returnUser.dto';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const mockAuthService = {
      login: jest.fn().mockResolvedValue({
        user: {
          id: 1,
          name: 'John Doe',
          email: 'john.doe@example.com',
        } as ReturnUserDTO,
        accessToken: 'fake-jwt-token',
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  describe('login', () => {
    it('should return a login response with user and access token', async () => {
      const loginDTO: LoginDTO = {
        email: 'john.doe@example.com',
        password: 'password123',
      };

      const expectedResponse: ReturnLoginDTO = {
        user: {
          id: 1,
          name: 'John Doe',
          email: 'john.doe@example.com',
        } as ReturnUserDTO,
        accessToken: 'fake-jwt-token',
      };

      const result = await controller.login(loginDTO);

      expect(result).toEqual(expectedResponse);
      expect(service.login).toHaveBeenCalledWith(loginDTO);
    });
  });
});
