import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import { AddHolidaysDto } from './dto/add-holiday.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CalendarEventEntity } from './entities/calendar-event.entity';
import { UserEntity } from '../user/entities/user.entity';

@Injectable()
export class CalendarService {
  constructor(
    @InjectRepository(CalendarEventEntity)
    private readonly calendarRepo: Repository<CalendarEventEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}

  async addHolidaysToCalendar(userId: string, dto: AddHolidaysDto) {
    try {
      const { countryCode, year, holidays } = dto;

      const { data } = await axios.get(
        `https://date.nager.at/api/v3/PublicHolidays/${year}/${countryCode}`,
      );

      let selected = data as Array<{ localName: string; date: string }>;

      if (holidays?.length) {
        const set = new Set(holidays);
        selected = selected.filter((h) => set.has(h.localName));
      }

      const user = await this.userRepo.findOne({ where: { id: userId } });
      if (!user) {
        throw new HttpException(`User ${userId} not found`, HttpStatus.NOT_FOUND);
      }

      const events = selected.map((h) =>
        this.calendarRepo.create({
          title: h.localName,
          date: h.date,
          countryCode,
          user,
        }),
      );

      await this.calendarRepo.save(events);

      return {
        message: `${events.length} holidays added to user ${userId}'s calendar.`,
        savedHolidays: events,
      };
    } catch (error: any) {
      throw new HttpException(
        `Failed to add holidays: ${error.message}`,
        HttpStatus.BAD_GATEWAY,
      );
    }
  }

  async getUserCalendar(userId: string) {
    return this.calendarRepo.find({
      where: { user: { id: userId } },
      relations: ['user'],
      order: { date: 'ASC' },
    });
  }
}
