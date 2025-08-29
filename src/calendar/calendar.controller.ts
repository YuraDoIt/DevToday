import {
  Controller,
  Post,
  Param,
  Body,
  Get,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBody } from '@nestjs/swagger';
import { CalendarService } from './calendar.service';
import { AddHolidaysDto } from './dto/add-holiday.dto';

@ApiTags('Calendar')
@Controller('users/:userId/calendar')
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @Post('holidays')
  @ApiOperation({ summary: 'Add national holidays to user calendar' })
  @ApiParam({ name: 'userId', type: String })
  @ApiBody({ type: AddHolidaysDto })
  async addHolidays(
    @Param('userId') userId: string,
    @Body() dto: AddHolidaysDto,
  ) {
    return this.calendarService.addHolidaysToCalendar(userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get user calendar' })
  async getUserCalendar(@Param('userId') userId: string) {
    return this.calendarService.getUserCalendar(userId);
  }
}
