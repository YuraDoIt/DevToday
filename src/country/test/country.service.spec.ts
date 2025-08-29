import { Test, TestingModule } from '@nestjs/testing';
import { CountryService } from '../country.service';
import { ConfigService } from '@nestjs/config';

describe('CountryService', () => {
  let service: CountryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CountryService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('mock-value'),
          },
        },
      ],
    }).compile();

    service = module.get<CountryService>(CountryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
