import { Test, TestingModule } from '@nestjs/testing';
import { CoffeesService } from '@/coffees/coffees.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Flavor } from '@/coffees/entities/flavor.entity';
import { Coffee } from '@/coffees/entities/coffee.entity';
import { COFFEE_BRANDS } from '@/coffees/coffees.constants';
import { ConfigModule, ConfigService } from '@nestjs/config';

const mockCoffeeRepository = {
  find: jest.fn(),
  create: jest.fn(),
};

const mockFlavorRepository = {
  find: jest.fn(),
  create: jest.fn(),
};

const mockConfigService = {
  get: jest.fn((key: string) => {
    if (key === 'coffees') {
      return {};
    }
    return null;
  }),
};

describe('CoffeesService', () => {
  let service: CoffeesService;
  let coffeeRepository: Repository<Coffee>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [
        CoffeesService,
        {
          provide: DataSource,
          useValue: {},
        },
        {
          provide: getRepositoryToken(Coffee),
          useValue: mockCoffeeRepository,
        },
        {
          provide: getRepositoryToken(Flavor),
          useValue: mockFlavorRepository,
        },
        {
          provide: COFFEE_BRANDS,
          useValue: ['buddy brew', 'nescafe'],
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: 'CONFIGURATION(coffees)',
          useValue: mockConfigService.get('coffees'),
        },
      ],
    }).compile();

    service = module.get<CoffeesService>(CoffeesService);
    coffeeRepository = module.get<Repository<Coffee>>(
      getRepositoryToken(Coffee),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
