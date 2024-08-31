import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as request from 'supertest';
import { CoffeesModule } from '@/coffees/coffees.module';
import { CreateCoffeeDto } from '@/coffees/dto/create-coffee.dto';

describe('[Feature] Coffees - /coffees', () => {
  const coffee: CreateCoffeeDto = {
    name: 'Shipwreck Roast',
    brand: 'Buddy Brew',
    flavors: ['chocolate', 'vanilla'],
  };

  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        CoffeesModule,
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: 'localhost',
          port: 5433,
          username: 'postgres',
          password: 'postgres',
          database: 'test-db',
          autoLoadEntities: true,
          synchronize: true,
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );

    await app.init();
  });

  it('Create [POST /]', async () => {
    const { body } = await request(app.getHttpServer())
      .post('/coffees')
      .send(coffee as CreateCoffeeDto)
      .expect(HttpStatus.CREATED);

    const expectedCoffee = expect.objectContaining({
      ...coffee,
      flavors: expect.arrayContaining(
        coffee.flavors.map((name) => expect.objectContaining({ name })),
      ),
    });

    expect(body).toEqual(expectedCoffee);
  });

  it('Get all [GET /]', async () => {
    const { body } = await request(app.getHttpServer())
      .get('/coffees')
      .expect(HttpStatus.OK);

    const expectedCoffees = [
      expect.objectContaining({
        name: 'Shipwreck Roast',
        brand: 'Buddy Brew',
        flavors: expect.arrayContaining([
          expect.objectContaining({ name: 'chocolate' }),
          expect.objectContaining({ name: 'vanilla' }),
        ]),
      }),
    ];

    expect(body).toEqual(expect.arrayContaining(expectedCoffees));
  });

  it('Get one [GET /:id]', async () => {
    // First, create a new coffee to ensure it exists
    const coffee: CreateCoffeeDto = {
      name: 'Espresso',
      brand: 'Starbucks',
      flavors: ['caramel', 'hazelnut'],
    };

    const createResponse = await request(app.getHttpServer())
      .post('/coffees')
      .send(coffee as CreateCoffeeDto)
      .expect(HttpStatus.CREATED);

    const createdCoffee = createResponse.body;

    // Now, get the coffee by ID
    const { body } = await request(app.getHttpServer())
      .get(`/coffees/${createdCoffee.id}`)
      .expect(HttpStatus.OK);

    const expectedCoffee = expect.objectContaining({
      name: 'Espresso',
      brand: 'Starbucks',
      flavors: expect.arrayContaining([
        expect.objectContaining({ name: 'caramel' }),
        expect.objectContaining({ name: 'hazelnut' }),
      ]),
    });

    expect(body).toEqual(expectedCoffee);
  });

  it.todo('Update one [PATCH /:id]');
  it.todo('Delete one [DELETE /:id]');

  afterAll(async () => {
    if (app) await app.close();
  });
});
