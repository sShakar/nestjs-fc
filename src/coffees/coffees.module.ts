import { Module } from '@nestjs/common';
import { CoffeesController } from './coffees.controller';
import { CoffeesService } from '@/coffees/coffees.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Coffee } from '@/coffees/entities/coffee.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Coffee])],
  controllers: [CoffeesController],
  providers: [CoffeesService],
})
export class CoffeesModule {}
