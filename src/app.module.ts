import { CoffeesModule } from '@/coffees/coffees.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    CoffeesModule,
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
