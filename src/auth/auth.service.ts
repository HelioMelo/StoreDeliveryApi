import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UserService } from '../user/user.service';

import { UserEntity } from '../user/entities/user.entity';
import { compare } from 'bcrypt';
import { ReturnUserDTO } from '../user/dtos/returnUser.dto';

import { LoginDTO } from './dto/login.dto';
import { LoginPayloadDTO } from './dto/loginPayload.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login(
    loginDTO: LoginDTO,
  ): Promise<{ accessToken: string; user: ReturnUserDTO }> {
    const user: UserEntity | undefined = await this.userService
      .findUserByEmail(loginDTO.email)
      .catch(() => undefined);

    if (!user) {
      throw new NotFoundException('Email or password invalid');
    }

    const isMatch = await compare(loginDTO.password, user.password || '');

    if (!isMatch) {
      throw new NotFoundException('Email or password invalid');
    }

    return {
      accessToken: this.jwtService.sign({ ...new LoginPayloadDTO(user) }),
      user: new ReturnUserDTO(user),
    };
  }
}
