import { Test, TestingModule } from '@nestjs/testing';
import { CalendarController } from '../calendar.controller';
import { CalendarService } from '../calendar.service';
import { AddHolidaysDto } from '../dto/add-holiday.dto';

describe('CalendarController', () => {
  let controller: CalendarController;
  let service: CalendarService;

  const mockCalendarService = {
    addHolidaysToCalendar: jest.fn(),
    getUserCalendar: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CalendarController],
      providers: [
        {
          provide: CalendarService,
          useValue: mockCalendarService,
        },
      ],
    }).compile();

    controller = module.get<CalendarController>(CalendarController);
    service = module.get<CalendarService>(CalendarService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('addHolidays', () => {
    it('should call service to add holidays and return result', async () => {
      const userId = 'user123';
      const dto: AddHolidaysDto = {
        countryCode: 'US',
        year: 2025,
        holidays: ['New Year\'s Day'],
      };

      const expectedResult = {
        message: '1 holidays added to user user123\'s calendar.',
        savedHolidays: [{ title: "New Year's Day", date: '2025-01-01' }],
      };

      mockCalendarService.addHolidaysToCalendar.mockResolvedValue(expectedResult);

      const result = await controller.addHolidays(userId, dto);

      expect(service.addHolidaysToCalendar).toHaveBeenCalledWith(userId, dto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getUserCalendar', () => {
    it('should return calendar events for a user', async () => {
      const userId = 'user456';
      const expectedEvents = [
        { title: 'Test Event', date: '2025-01-01', countryCode: 'US' },
      ];

      mockCalendarService.getUserCalendar.mockResolvedValue(expectedEvents);

      const result = await controller.getUserCalendar(userId);

      expect(service.getUserCalendar).toHaveBeenCalledWith(userId);
      expect(result).toEqual(expectedEvents);
    });
  });
});
