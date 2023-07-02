import { ConfigService } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

export function getDataSource(configService: ConfigService) {
  const dataSourceOptions: DataSourceOptions = {
    type: 'mysql',
    host: configService.get<string>('DB_HOST'),
    username: configService.get<string>('DB_USERNAME'),
    password: configService.get<string>('DB_PASSWORD'),
    database: configService.get<string>('DB_DATABASE'),
    entities: ['dist/**/*.entity.js'],
    migrations: ['dist/database/migrations/*.js'],
  };

  return dataSourceOptions;
}

const dataSource = new DataSource(getDataSource(new ConfigService()));

export default dataSource;
