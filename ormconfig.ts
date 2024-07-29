import { DataSource, DataSourceOptions } from 'typeorm';

export const dataSourceOptions: any = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'nestjs-fc',
  entities: ['dist/**/*.entity.ts'],
  migrations: ['dist/migrations/*.ts'],
  cli: {
    migrationsDir: 'src/migrations',
  },
};

export const dataSource = new DataSource(dataSourceOptions);

dataSource
  .initialize()
  .then(() => console.log('Database initialized'))
  .catch((err) => console.error(err));
