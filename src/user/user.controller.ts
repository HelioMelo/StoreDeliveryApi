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
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { CreateUserDTO } from './dtos/createUser.dto';
import { UserService } from './user.service';
import { ReturnUserDTO } from './dtos/returnUser.dto';
import { UserEntity } from './entities/user.entity';
import { UserType } from './enum/user-type.enum';

@Controller('user')
@ApiTags('User')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UsePipes(ValidationPipe)
  @Post()
  @ApiOperation({ summary: 'Create new user' })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    type: UserEntity,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async createUser(@Body() createUser: CreateUserDTO): Promise<UserEntity> {
    return this.userService.createUser(createUser);
  }

  @Roles(UserType.Admin, UserType.Root)
  @Get('/all')
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'Successful response',
    type: [ReturnUserDTO],
  })
  @ApiResponse({ status: 404, description: 'Users not found' })
  async getAllUser(): Promise<ReturnUserDTO[]> {
    return (await this.userService.getAllUser()).map(
      (userEntity) => new ReturnUserDTO(userEntity),
    );
  }

  @Roles(UserType.Admin, UserType.Root)
  @Get('/:userId')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({ name: 'userId', description: 'ID of the user', required: true })
  @ApiResponse({
    status: 200,
    description: 'Successful response',
    type: ReturnUserDTO,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getUserById(@Param('userId') userId: number): Promise<ReturnUserDTO> {
    return new ReturnUserDTO(
      await this.userService.getUserByIdUsingRelations(userId),
    );
  }

  @Roles(UserType.Admin, UserType.Root)
  @Get()
  @ApiOperation({ summary: 'Get information of the authenticated user' })
  @ApiResponse({
    status: 200,
    description: 'Successful response',
    type: ReturnUserDTO,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getInfoUser(@UserId() userId: number): Promise<ReturnUserDTO> {
    return new ReturnUserDTO(
      await this.userService.getUserByIdUsingRelations(userId),
    );
  }
}
