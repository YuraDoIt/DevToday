import { Controller, Get, HttpException, HttpStatus, Param } from '@nestjs/common';
import { CountryService, Country } from './country.service';

@Controller('countries')
export class CountryController {
  constructor(private readonly countryService: CountryService) {}

  @Get()
  async getAvailableCountries(): Promise<Country[]> {
    try {
      return await this.countryService.getAvailableCountries();
    } catch (error) {
      throw new HttpException(
        `Failed to fetch available countries: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':countryCode')
  async getCountryDetails(@Param('countryCode') countryCode: string): Promise<any> {
    try {
      return await this.countryService.getCountryDetails(countryCode);
    } catch (error) {
      throw new HttpException(
        `Failed to fetch country details: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
