import { Module } from '@nestjs/common';
import { CountryService } from './country/country.service';
import { CountryController } from './country/country.controller';

@Module({
  providers: [CountryService],
  controllers: [CountryController]
})
export class CountryModule {}
