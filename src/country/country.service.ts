import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { Country, CountryInfo, PopulationData, FlagData } from './country.interface';



@Injectable()
export class CountryService {
  constructor(
    private readonly configService: ConfigService,
  ) {}

  async getAvailableCountries(): Promise<Country[]> {
    try {
      const baseUrl = this.configService.get<string>('DATE_NAGER_API_BASE_URL');
      const response = await axios.get<Country[]>(`${baseUrl}/AvailableCountries`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch available countries: ${error.message}`);
    }
  }

  async getCountryInfo(countryCode: string): Promise<CountryInfo> {
    try {
      const baseUrl = this.configService.get<string>('DATE_NAGER_API_BASE_URL');
      const response = await axios.get<CountryInfo>(`${baseUrl}/CountryInfo/${countryCode}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch country info: ${error.message}`);
    }
  }

  async getPopulationData(countryName: string): Promise<PopulationData> {
  try {
    const baseUrl = this.configService.get<string>('COUNTRIES_NOW_API_BASE_URL');
    const response = await axios.post<PopulationData>(`${baseUrl}/population`, {
      country: countryName,
    });
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch population data: ${error.message}`);
  }
}

  async getFlagData(countryCode: string): Promise<FlagData> {
    try {
      const baseUrl = this.configService.get<string>('COUNTRIES_NOW_API_BASE_URL');
      const response = await axios.post<FlagData>(`${baseUrl}/flag/images`, {
        iso2: countryCode,
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch flag data: ${error.message}`);
    }
  }

  async getCountryNameFromCode(countryCode: string): Promise<string> {
  const baseUrl = this.configService.get<string>('DATE_NAGER_API_BASE_URL');
  const response = await axios.get(`${baseUrl}/AvailableCountries`);
  const countries: Country[] = response.data;

  const matched = countries.find(
    (c) => c.countryCode.toUpperCase() === countryCode.toUpperCase(),
  );

  if (!matched) {
    throw new Error(`Country with code ${countryCode} not found`);
  }

  return matched.name;
}

  async getCountryDetails(countryCode: string): Promise<any> {
    try {
      const countryInfo = await this.getCountryInfo(countryCode);
      const countryName = await this.getCountryNameFromCode(countryCode);

      const [populationData, flagData] = await Promise.all([
        this.getPopulationData(countryName),
        this.getFlagData(countryCode),
      ]);

      return {
        name: countryInfo.name,
        countryCode: countryInfo.countryCode,
        borders: countryInfo.borders,
        populationData: populationData.populationCounts,
        flagUrl: flagData.flag,
      };
    } catch (error) {
      throw new HttpException(
        `Failed to fetch country details: ${error.message}`,
        HttpStatus.BAD_GATEWAY,
      );
    }
  }
}
