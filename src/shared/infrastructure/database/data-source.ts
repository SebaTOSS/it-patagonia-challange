import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { CompanyOrmEntity } from '../../../companies/infrastructure/database/entities/company.orm-entity';
import { TransferOrmEntity } from '../../../companies/infrastructure/database/entities/transfer.orm-entity';

const getBaseConfig = (configService: ConfigService): DataSourceOptions => ({
    type: 'postgres',
    host: configService.get<string>('DATABASE_HOST'),
    port: configService.get<number>('DATABASE_PORT'),
    username: configService.get<string>('DATABASE_USERNAME'),
    password: configService.get<string>('DATABASE_PASSWORD'),
    database: configService.get<string>('DATABASE_NAME'),
    entities: [CompanyOrmEntity, TransferOrmEntity],
    synchronize: false,
    migrationsRun: true,
    migrations: [__dirname + '/migrations/*{.ts,.js}'],
    logging: ['query', 'error'],
  });
  
  // NestJS TypeORM Module configuration
  export const getTypeOrmConfig = (configService: ConfigService): TypeOrmModuleOptions => {
    return getBaseConfig(configService);
  };
  
  // Instance for scripts
  const configService = new ConfigService();
  export default new DataSource(getBaseConfig(configService));