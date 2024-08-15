import { Injectable, Module } from '@nestjs/common';
import { CoffeesController } from './coffees.controller';
import { CoffeesService } from '@/coffees/coffees.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Coffee } from '@/coffees/entities/coffee.entity';
import { Flavor } from '@/coffees/entities/flavor.entity';
import { Event } from '@/events/entities/event.entity';
import { COFFEE_BRANDS } from '@/coffees/coffees.constants';
import { ConfigModule } from '@nestjs/config';
import coffeesConfig from '@/coffees/config/coffees.config';

class ConfigService {}
class DevelopmentConfigService {}
class ProductionConfigService {}

@Injectable()
export class CoffeeBrandsFactory {
  create() {
    return ['buddy brew', 'nescafe'];
  }
}

@Module({
  imports: [
    TypeOrmModule.forFeature([Coffee, Flavor, Event]),
    ConfigModule.forFeature(coffeesConfig),
  ],
  controllers: [CoffeesController],
  providers: [
    CoffeesService,
    CoffeeBrandsFactory,
    {
      provide: ConfigService,
      useClass:
        process.env.NODE_ENV === 'development'
          ? DevelopmentConfigService
          : ProductionConfigService,
    },
    {
      provide: COFFEE_BRANDS,
      useFactory: (brandsFactory: CoffeeBrandsFactory) =>
        brandsFactory.create(),
      inject: [CoffeeBrandsFactory],
    },
  ],
  exports: [CoffeesService],
})
export class CoffeesModule {}
