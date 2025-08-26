import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import { AddHolidaysDto } from './dto/create-holiday.dto';

@Injectable()
export class CalendarService {
  private userCalendars: Record<string, any[]> = {}; // Simulated DB

  async addHolidaysToCalendar(userId: string, dto: AddHolidaysDto): Promise<any> {
    try {
      const { countryCode, year, holidays } = dto;
      const response = await axios.get(
        `https://date.nager.at/api/v3/PublicHolidays/${year}/${countryCode}`
      );

      let allHolidays = response.data; // Array of holiday objects

      if (holidays && holidays.length > 0) {
        allHolidays = allHolidays.filter((h: any) =>
          holidays.includes(h.localName)
        );
      }

      // Save to in-memory DB
      if (!this.userCalendars[userId]) {
        this.userCalendars[userId] = [];
      }

      this.userCalendars[userId].push(...allHolidays);

      return {
        message: `${allHolidays.length} holidays added to user ${userId}'s calendar.`,
        savedHolidays: allHolidays,
      };
    } catch (error) {
      throw new HttpException(
        `Failed to add holidays: ${error.message}`,
        HttpStatus.BAD_GATEWAY
      );
    }
  }

  // Optional: get calendar
  getUserCalendar(userId: string) {
    return this.userCalendars[userId] || [];
  }
}
