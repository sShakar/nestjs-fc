import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoffeesModule } from '@/coffees/coffees.module';
import { CoffeeRatingModule } from '@/coffee-rating/coffee-rating.module';

@Module({
  imports: [
    CoffeesModule,
    CoffeeRatingModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'nestjs-fc',
      autoLoadEntities: true,
      synchronize: true,
    }),
  ],
})
export class AppModule {}
