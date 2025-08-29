import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../users.controller';
import { UsersService } from '../users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUsersService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
      const body = { name: 'Alice', email: 'alice@example.com' };
      const result = { id: '1', ...body };

      mockUsersService.create.mockResolvedValue(result);

      expect(await controller.create(body)).toEqual(result);
      expect(mockUsersService.create).toHaveBeenCalledWith(body.name, body.email);
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const result = [
        { id: '1', name: 'User1', email: 'u1@example.com' },
        { id: '2', name: 'User2', email: 'u2@example.com' },
      ];

      mockUsersService.findAll.mockResolvedValue(result);

      expect(await controller.findAll()).toEqual(result);
    });
  });

  describe('findOne', () => {
    it('should return a user by ID', async () => {
      const userId = '123';
      const result = { id: userId, name: 'User123', email: 'u123@example.com' };

      mockUsersService.findOne.mockResolvedValue(result);

      expect(await controller.findOne(userId)).toEqual(result);
      expect(mockUsersService.findOne).toHaveBeenCalledWith(userId);
    });
  });
});
