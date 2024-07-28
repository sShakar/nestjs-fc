module.exports = {
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
