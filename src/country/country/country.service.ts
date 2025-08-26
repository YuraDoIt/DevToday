import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

export interface Country {
  countryCode: string;
  name: string;
}

export interface CountryInfo {
  name: string;
  countryCode: string;
  borders: BorderCountry[];
}

export interface BorderCountry {
  commonName: string;
  officialName: string;
  countryCode: string;
  region: string;
  borders: string[];
}

export interface PopulationData {
  country: string;
  code: string;
  iso3: string;
  populationCounts: PopulationCount[];
}

export interface PopulationCount {
  year: number;
  value: number;
}

export interface FlagData {
  name: string;
  flag: string;
}

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

  async getPopulationData(countryCode: string): Promise<PopulationData> {
    try {
      const baseUrl = this.configService.get<string>('COUNTRIES_NOW_API_BASE_URL');
      const response = await axios.post<PopulationData>(`${baseUrl}/population`, {
        country: countryCode,
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

  async getCountryDetails(countryCode: string): Promise<any> {
    try {
      // Fetch data from all three sources in parallel
      const [countryInfo, populationData, flagData] = await Promise.all([
        this.getCountryInfo(countryCode),
        this.getPopulationData(countryCode),
        this.getFlagData(countryCode),
      ]);

      // Combine the data
      return {
        name: countryInfo.name,
        countryCode: countryInfo.countryCode,
        borders: countryInfo.borders,
        populationData: populationData.populationCounts,
        flagUrl: flagData.flag,
      };
    } catch (error) {
      throw new Error(`Failed to fetch country details: ${error.message}`);
    }
  }
}
