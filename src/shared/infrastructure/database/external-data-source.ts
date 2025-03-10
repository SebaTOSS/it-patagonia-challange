import { DataSource } from "typeorm";
import { CompanyOrmEntity } from '../../../companies/infrastructure/database/entities/company.orm-entity';
import { TransferOrmEntity } from '../../../companies/infrastructure/database/entities/transfer.orm-entity';
import { ConfigService } from "@nestjs/config";
import { config } from "dotenv";

config();

const configService = new ConfigService();

const dataSource = new DataSource({
    type: 'postgres',
    host: configService.get('DATABASE_HOST'),
    port: configService.get('DATABASE_PORT'),
    username: configService.get('DATABASE_USERNAME'),
    password: configService.get('DATABASE_PASSWORD'),
    database: configService.get('DATABASE_NAME'),
    entities: [CompanyOrmEntity, TransferOrmEntity],
    migrations: ['./src/shared/infrastructure/database/migrations/*.ts'],
    synchronize: false,
    logging: true,
});

export default dataSource;