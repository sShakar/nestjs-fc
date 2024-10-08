import { APP_PIPE } from '@nestjs/core';
import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Joi from '@hapi/joi';
import appConfig from '@/config/app.config';
import { CoffeesModule } from '@/coffees/coffees.module';
import { CoffeeRatingModule } from '@/coffee-rating/coffee-rating.module';
import { CommonModule } from '@/common/common.module';
import { AppService } from '@/app.service';
import { AppController } from '@/app.controller';

@Module({
  imports: [
    CommonModule,
    CoffeesModule,
    CoffeeRatingModule,
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        DATABASE_HOST: Joi.required(),
        DATABASE_PORT: Joi.number().default(5432),
      }),
      load: [appConfig],
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: process.env.DATABASE_HOST,
        port: +process.env.DATABASE_PORT,
        username: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
  ],
  providers: [AppService, { provide: APP_PIPE, useClass: ValidationPipe }],
  controllers: [AppController],
})
export class AppModule {}
