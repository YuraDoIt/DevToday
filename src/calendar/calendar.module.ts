import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CalendarService } from './calendar.service';
import { CalendarController } from './calendar.controller';
import { CalendarEventEntity } from './entities/calendar-event.entity';
import { UserEntity } from 'src/user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CalendarEventEntity, UserEntity])],
  controllers: [CalendarController],
  providers: [CalendarService],
})
export class CalendarModule {}
