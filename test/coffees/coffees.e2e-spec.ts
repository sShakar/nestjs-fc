import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as request from 'supertest';
import { CoffeesModule } from '@/coffees/coffees.module';
import { CreateCoffeeDto } from '@/coffees/dto/create-coffee.dto';
import { UpdateCoffeeDto } from '@/coffees/dto/update-coffee.dto';

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

  it('Update one [PATCH /:id]', async () => {
    // First, create a new coffee to ensure it exists
    const coffee: CreateCoffeeDto = {
      name: 'Mocha',
      brand: 'Coffee Brand',
      flavors: ['hazelnut'],
    };

    const createResponse = await request(app.getHttpServer())
      .post('/coffees')
      .send(coffee as CreateCoffeeDto)
      .expect(HttpStatus.CREATED);

    const createdCoffee = createResponse.body;

    // Now, update the coffee by ID
    const updateCoffeeDto: UpdateCoffeeDto = {
      name: 'Updated Mocha',
      brand: 'Updated Coffee Brand',
    };

    // Perform the PATCH request
    const patchResponse = await request(app.getHttpServer())
      .patch(`/coffees/${createdCoffee.id}`)
      .send(updateCoffeeDto as UpdateCoffeeDto)
      .expect(HttpStatus.OK);

    // Validate the immediate response
    expect(patchResponse.body).toEqual(
      expect.objectContaining({
        id: createdCoffee.id,
        name: 'Updated Mocha',
        brand: 'Updated Coffee Brand',
      }),
    );

    // Fetch the updated coffee details to validate full object
    const { body } = await request(app.getHttpServer())
      .get(`/coffees/${createdCoffee.id}`)
      .expect(HttpStatus.OK);

    const expectedUpdatedCoffee = expect.objectContaining({
      id: createdCoffee.id,
      name: 'Updated Mocha',
      brand: 'Updated Coffee Brand',
      recommendations: createdCoffee.recommendations, // Ensure this matches the original value
      flavors: expect.arrayContaining([
        expect.objectContaining({ name: 'hazelnut' }), // Original flavor should remain
      ]),
    });

    expect(body).toEqual(expectedUpdatedCoffee);
  });

  it('Delete one [DELETE /:id]', async () => {
    // First, create a new coffee to ensure it exists
    const coffee: CreateCoffeeDto = {
      name: 'Americano',
      brand: 'Local Brew',
      flavors: ['vanilla'],
    };

    const createResponse = await request(app.getHttpServer())
      .post('/coffees')
      .send(coffee as CreateCoffeeDto)
      .expect(HttpStatus.CREATED);

    const createdCoffee = createResponse.body;

    // Now, delete the coffee by ID
    await request(app.getHttpServer())
      .delete(`/coffees/${createdCoffee.id}`)
      .expect(HttpStatus.OK);

    // Try to fetch the deleted coffee to ensure it was removed
    await request(app.getHttpServer())
      .get(`/coffees/${createdCoffee.id}`)
      .expect(HttpStatus.NOT_FOUND);
  });

  afterAll(async () => {
    if (app) await app.close();
  });
});
