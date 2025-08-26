import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CountryModule } from './country/country.module';
import { ConfigModule } from './config/config.module';
import { CalendarModule } from './calendar/calendar.module';

@Module({
  imports: [CountryModule, CalendarModule, ConfigModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
