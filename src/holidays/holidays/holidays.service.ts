import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

export interface Holiday {
  date: string;
  localName: string;
  name: string;
  countryCode: string;
  fixed: boolean;
  global: boolean;
  counties: string[] | null;
  launchYear: number | null;
  types: string[];
}

export interface CalendarEvent {
  id: string;
  userId: string;
  title: string;
  date: string;
  countryCode: string;
}

// Mock database for calendar events
const calendarEvents: CalendarEvent[] = [];

@Injectable()
export class HolidaysService {
  constructor(
    private readonly configService: ConfigService,
  ) {}

  async getPublicHolidays(year: number, countryCode: string): Promise<Holiday[]> {
    try {
      const baseUrl = this.configService.get<string>('DATE_NAGER_API_BASE_URL');
      const response = await axios.get<Holiday[]>(`${baseUrl}/PublicHolidays/${year}/${countryCode}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch public holidays: ${error.message}`);
    }
  }

  async addHolidaysToCalendar(
    userId: string,
    countryCode: string,
    year: number,
    holidayNames?: string[],
  ): Promise<CalendarEvent[]> {
    try {
      // Fetch public holidays
      const holidays = await this.getPublicHolidays(year, countryCode);
      
      // Filter holidays if specific names are provided
      let filteredHolidays = holidays;
      if (holidayNames && holidayNames.length > 0) {
        filteredHolidays = holidays.filter(holiday =>
          holidayNames.includes(holiday.name) || holidayNames.includes(holiday.localName)
        );
      }
      
      // Create calendar events
      const calendarEventsToAdd: CalendarEvent[] = filteredHolidays.map(holiday => ({
        id: `${userId}-${countryCode}-${holiday.date}-${holiday.name}`.replace(/\s+/g, '-'),
        userId,
        title: holiday.name,
        date: holiday.date,
        countryCode,
      }));
      
      // Add events to mock database
      calendarEvents.push(...calendarEventsToAdd);
      
      return calendarEventsToAdd;
    } catch (error) {
      throw new Error(`Failed to add holidays to calendar: ${error.message}`);
    }
  }

  // Mock method to get user's calendar events
  getUserCalendarEvents(userId: string): CalendarEvent[] {
    return calendarEvents.filter(event => event.userId === userId);
  }
}
