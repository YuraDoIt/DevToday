import { Module } from '@nestjs/common';
import { CountryModule } from './country/country.module';
import { ConfigModule } from './config/config.module';
import { CalendarModule } from './calendar/calendar.module';

@Module({
  imports: [CountryModule, CalendarModule, ConfigModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
