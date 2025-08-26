import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { Country, CountryInfo, PopulationData, FlagData } from './country.interface';



@Injectable()
export class CountryService {
  constructor(
    private readonly configService: ConfigService,
  ) {}

async getCountryInfo(code: string): Promise<CountryInfo> {
    const baseUrl = this.configService.get<string>('DATE_NAGER_API_BASE_URL');
    const response = await axios.get<CountryInfo>(`${baseUrl}/CountryInfo/${code}`);
    return response.data;
  }

  async getAvailableCountries(): Promise<Country[]> {
    const baseUrl = this.configService.get<string>('DATE_NAGER_API_BASE_URL');
    const response = await axios.get<Country[]>(`${baseUrl}/AvailableCountries`);
    return response.data;
  }

  async getCountryNameFromCode(code: string): Promise<string> {
    const countries = await this.getAvailableCountries();
    const match = countries.find(c => c.countryCode === code);
    if (!match) throw new Error(`Country code ${code} not found.`);
    return match.name;
  }

  async getPopulationData(name: string): Promise<PopulationData> {
    const baseUrl = this.configService.get<string>('COUNTRIES_NOW_API_BASE_URL');
    const response = await axios.post(`${baseUrl}/population`, {
      country: name,
    });
    if (!response.data || !response.data.data) {
      throw new Error(`Population data not found for ${name}`);
    }
    return response.data.data;
  }

  async getFlagData(code: string) {
    const baseUrl = this.configService.get<string>('COUNTRIES_NOW_API_BASE_URL');
    const countries = await this.getAvailableCountries();
    const name = countries.find(c => c.countryCode === code)?.name;
    if (!name) throw new Error(`Country name not found for code: ${code}`);

    const response = await axios.post(`${baseUrl}/flag/images`, {
      iso2: code,
    });

    if (!response.data?.data) {
      throw new Error(`Flag not found for code ${code}`);
    }

    return response.data.data;
  }

  async getCountryDetails(countryCode: string): Promise<any> {
    try {
      // 1. Get info from Nager API (includes borders)
      const countryInfo = await this.getCountryInfo(countryCode);

      // 2. Get country name to use in CountriesNow API
      const countryName = await this.getCountryNameFromCode(countryCode);

      // 3. Get flag + population data in parallel
      const [populationData, flagData] = await Promise.all([
        this.getPopulationData(countryName),
        this.getFlagData(countryCode),
      ]);

      return {
        name: countryInfo.name,
        countryCode: countryInfo.countryCode,
        borders: countryInfo.borders, // Already detailed
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
