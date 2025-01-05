import { Roles } from './../decorators/roles.decorators';
import {
  Controller,
  Post,
  Body,
  Get,
  UsePipes,
  ValidationPipe,
  Param,
} from '@nestjs/common';
import { CreateUserDTO } from './dtos/createUser.dto';
import { UserService } from './user.service';

import { ReturnUserDTO } from './dtos/returnUser.dto';
import { UserEntity } from './entities/user.entity';
import { UserType } from './enum/user-type.enum';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UsePipes(ValidationPipe)
  @Post()
  async createUser(@Body() createUser: CreateUserDTO): Promise<UserEntity> {
    return this.userService.createUser(createUser);
  }

  @Roles(UserType.Admin)
  @Get()
  async getAllUser(): Promise<ReturnUserDTO[]> {
    return (await this.userService.getAllUser()).map(
      (userEntity) => new ReturnUserDTO(userEntity),
    );
  }

  @Get('/:userId')
  async getUserById(@Param('userId') userId: number): Promise<ReturnUserDTO> {
    return new ReturnUserDTO(
      await this.userService.getUserByIdUsingRelations(userId),
    );
  }
}
