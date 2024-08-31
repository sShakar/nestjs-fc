import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as request from 'supertest';
import { CoffeesModule } from '@/coffees/coffees.module';
import { CreateCoffeeDto } from '@/coffees/dto/create-coffee.dto';

describe('[Feature] Coffees - /coffees', () => {
  const coffee = {
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

  it.todo('Get all [GET /]');
  it.todo('Get one [GET /:id]');
  it.todo('Update one [PATCH /:id]');
  it.todo('Delete one [DELETE /:id]');

  afterAll(async () => {
    if (app) await app.close();
  });
});
