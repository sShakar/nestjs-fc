import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoffeesModule } from '@/coffees/coffees.module';
import { CoffeeRatingModule } from '@/coffee-rating/coffee-rating.module';
import { ConfigModule } from '@nestjs/config';
import * as Joi from '@hapi/joi';
import appConfig from '@/config/app.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        DATABASE_HOST: Joi.required(),
        DATABASE_PORT: Joi.number().default(5432),
      }),
      load: [appConfig],
    }),
    CoffeesModule,
    CoffeeRatingModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: +process.env.DATABASE_PORT,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      autoLoadEntities: true,
      synchronize: true,
    }),
  ],
})
export class AppModule {}
