import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DataSource, Repository } from 'typeorm';
import { CoffeesService } from '@/coffees/coffees.service';
import { COFFEE_BRANDS } from '@/coffees/coffees.constants';
import { Flavor } from '@/coffees/entities/flavor.entity';
import { Coffee } from '@/coffees/entities/coffee.entity';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

const mockCoffeeRepository = <T = any>(): MockRepository<T> => ({
  findOne: jest.fn(),
  find: jest.fn(),
  create: jest.fn(),
});

const mockFlavorRepository = <T = any>(): MockRepository<T> => ({
  findOne: jest.fn(),
  find: jest.fn(),
  create: jest.fn(),
});

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
  let coffeeRepository: MockRepository;

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
          useValue: mockCoffeeRepository(),
        },
        {
          provide: getRepositoryToken(Flavor),
          useValue: mockFlavorRepository(),
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
    coffeeRepository = module.get<MockRepository>(getRepositoryToken(Coffee));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    describe('when coffee with ID exists', () => {
      it('should return the coffee object', async () => {
        const coffeeId = '1';
        const expectedCoffee = {};

        coffeeRepository.findOne.mockReturnValue(expectedCoffee);
        const coffee = await service.findOne(coffeeId);
        expect(coffee).toEqual(expectedCoffee);
      });
    });

    describe('otherwise', () => {
      it('should throw the "NotFoundException"', async () => {
        const coffeeId = '1';
        coffeeRepository.findOne.mockReturnValue(undefined);

        try {
          await service.findOne(coffeeId);
        } catch (error) {
          expect(error).toBeInstanceOf(NotFoundException);
          expect(error.message).toBe(`Coffee #${coffeeId} not found`);
        }
      });
    });
  });
});
