import { Test, TestingModule } from '@nestjs/testing';
import { CalendarService } from '../calendar.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CalendarEventEntity } from '../entities/calendar-event.entity';
import { UserEntity } from '../../user/entities/user.entity';
import { Repository } from 'typeorm';
import axios from 'axios';
import { AddHolidaysDto } from '../dto/add-holiday.dto';

jest.mock('axios');

describe('CalendarService', () => {
  let service: CalendarService;
  let calendarRepo: jest.Mocked<Repository<CalendarEventEntity>>;
  let userRepo: jest.Mocked<Repository<UserEntity>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CalendarService,
        {
        provide: getRepositoryToken(CalendarEventEntity),
            useValue: {
                create: jest.fn(),
                save: jest.fn() as any,
                find: jest.fn(),
            },
        },
        {
          provide: getRepositoryToken(UserEntity),
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CalendarService>(CalendarService);
    calendarRepo = module.get(getRepositoryToken(CalendarEventEntity));
    userRepo = module.get(getRepositoryToken(UserEntity));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });


  describe('getUserCalendar', () => {
    it('should return user calendar sorted by date', async () => {
      const mockEvents: CalendarEventEntity[] = [
        {
          id: '1',
          title: 'Event A',
          date: '2025-01-01',
          countryCode: 'US',
          user: {} as UserEntity,
        },
        {
          id: '2',
          title: 'Event B',
          date: '2025-02-01',
          countryCode: 'US',
          user: {} as UserEntity,
        },
      ];

      calendarRepo.find.mockResolvedValue(mockEvents);

      const result = await service.getUserCalendar('user456');

      expect(calendarRepo.find).toHaveBeenCalledWith({
        where: { user: { id: 'user456' } },
        relations: ['user'],
        order: { date: 'ASC' },
      });
      expect(result).toEqual(mockEvents);
    });
  });
});
