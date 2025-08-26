import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CountryModule } from './country/country.module';
import { HolidaysModule } from './holidays/holidays.module';
import { ConfigModule } from './config/config.module';

@Module({
  imports: [CountryModule, HolidaysModule, ConfigModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
