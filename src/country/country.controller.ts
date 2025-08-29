import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { CountryService } from './country.service';
import { Country } from './interfaces/country.interface';

@ApiTags('Countries')
@Controller('countries')
export class CountryController {
  constructor(private readonly countryService: CountryService) {}

  @Get('available')
  @ApiOperation({ summary: 'Get list of available countries' })
  @ApiResponse({
    status: 200,
    description: 'List of available countries retrieved successfully',
  })
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

  @Get('info/:countryCode')
  @ApiOperation({
    summary: 'Get detailed country info (borders, population, flag)',
  })
  @ApiParam({
    name: 'countryCode',
    description: 'ISO2 country code (e.g. "UA", "US", "DE")',
    type: String,
  })
  async getCountryDetails(
    @Param('countryCode') countryCode: string,
  ): Promise<any> {
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
