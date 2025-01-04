import { CreateUserDTO } from './dtos/createUser.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}
  async createUser(createUserDTO: CreateUserDTO): Promise<UserEntity> {
    const saltOrRounds = 10;

    const passwordHashed = await bcrypt.hash(
      createUserDTO.password,
      saltOrRounds,
    );

    return this.userRepository.save({
      ...createUserDTO,
      typeUser: 1,
      password: passwordHashed,
    });
  }

  async getUserByIdUsingRelations(userId: number): Promise<UserEntity> {
    return await this.userRepository.findOne({
      where: {
        id: userId,
      },
      relations: ['addresses'],
    });
  }

  async getAllUser(): Promise<UserEntity[]> {
    return this.userRepository.find();
  }

  async findUserById(userId: number): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException(`usuario nao encontrado`);
    }
    return user;
  }

  async findUserByEmail(email: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: { email },
    });
    if (!user) {
      throw new NotFoundException(`Email: ${email} Not found`);
    }
    return user;
  }
}
