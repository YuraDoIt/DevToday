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