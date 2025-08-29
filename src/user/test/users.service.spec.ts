import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { Repository } from 'typeorm';

describe('UsersService', () => {
  let service: UsersService;
  let userRepo: Repository<UserEntity>;

  const mockUserRepo = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: mockUserRepo,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepo = module.get(getRepositoryToken(UserEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and save a user', async () => {
      const name = 'Alice';
      const email = 'alice@example.com';
      const mockUser = { name, email };

      mockUserRepo.create.mockReturnValue(mockUser);
      mockUserRepo.save.mockResolvedValue({ id: '1', ...mockUser });

      const result = await service.create(name, email);

      expect(userRepo.create).toHaveBeenCalledWith({ name, email });
      expect(userRepo.save).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual({ id: '1', name, email });
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const users = [{ id: '1' }, { id: '2' }];
      mockUserRepo.find.mockResolvedValue(users);

      const result = await service.findAll();

      expect(result).toEqual(users);
      expect(userRepo.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return user by ID', async () => {
      const id = '123';
      const user = { id, name: 'John', email: 'john@example.com' };
      mockUserRepo.findOne.mockResolvedValue(user);

      const result = await service.findOne(id);

      expect(result).toEqual(user);
      expect(userRepo.findOne).toHaveBeenCalledWith({ where: { id } });
    });
  });
});
