import { UserId } from './../decorators/user-id-decorator';
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

  @Roles(UserType.Admin, UserType.Root)
  @Get('/all')
  async getAllUser(): Promise<ReturnUserDTO[]> {
    return (await this.userService.getAllUser()).map(
      (userEntity) => new ReturnUserDTO(userEntity),
    );
  }

  @Roles(UserType.Admin, UserType.Root)
  @Get('/:userId')
  async getUserById(@Param('userId') userId: number): Promise<ReturnUserDTO> {
    return new ReturnUserDTO(
      await this.userService.getUserByIdUsingRelations(userId),
    );
  }

  @Roles(UserType.Admin, UserType.Root)
  @Get()
  async getInfoUser(@UserId() userId: number): Promise<ReturnUserDTO> {
    return new ReturnUserDTO(
      await this.userService.getUserByIdUsingRelations(userId),
    );
  }
}
