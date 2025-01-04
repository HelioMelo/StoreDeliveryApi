import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserType } from '../enum/user-type.enum';
import { UserService } from '../user.service';
import { UserEntityData } from '../testData/user.data';
import { createUserData } from '../testData/create.user.data';
import { UserEntity } from '../entities/user.entity';

describe('UserService', () => {
  let service: UserService;
  let userRepository: Repository<UserEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: {
            findOne: jest.fn().mockResolvedValue(UserEntityData),
            save: jest.fn().mockResolvedValue(UserEntityData),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get<Repository<UserEntity>>(
      getRepositoryToken(UserEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(userRepository).toBeDefined();
  });

  it('should return user in findUserByEmail', async () => {
    const user = await service.findUserByEmail(UserEntityData.email);

    expect(user).toEqual(UserEntityData);
  });

  it('should return error in findUserByEmail', async () => {
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(undefined);

    await expect(
      service.findUserByEmail(UserEntityData.email),
    ).rejects.toThrow();
  });

  it('should return error in findUserByEmail (error DB)', async () => {
    jest.spyOn(userRepository, 'findOne').mockRejectedValueOnce(new Error());

    await expect(
      service.findUserByEmail(UserEntityData.email),
    ).rejects.toThrow();
  });

  it('should return user in findUserById', async () => {
    const user = await service.findUserById(UserEntityData.id);

    expect(user).toEqual(UserEntityData);
  });

  it('should return error in findUserById', async () => {
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(undefined);

    await expect(service.findUserById(UserEntityData.id)).rejects.toThrow();
  });

  it('should return error in findUserById (error DB)', async () => {
    jest.spyOn(userRepository, 'findOne').mockRejectedValueOnce(new Error());

    await expect(service.findUserById(UserEntityData.id)).rejects.toThrow();
  });

  it('should return user in getUserByIdUsingRelations', async () => {
    const user = await service.getUserByIdUsingRelations(UserEntityData.id);

    expect(user).toEqual(UserEntityData);
  });

  it('should return error if user exist', async () => {
    await expect(service.createUser(createUserData)).rejects.toThrow();
  });

  it('should return user if user not exist', async () => {
    const spy = jest.spyOn(userRepository, 'save');
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(undefined);

    const user = await service.createUser(createUserData);

    expect(user).toEqual(UserEntityData);
    expect(spy.mock.calls[0][0].typeUser).toEqual(UserType.User);
  });
});
