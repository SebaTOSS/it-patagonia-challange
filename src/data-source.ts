import { DataSource } from "typeorm";
import { Company } from "./companies/domain/company.entity";
import { Transfer } from "./companies/domain/transfer.entity";
import { ConfigService } from "@nestjs/config";
import { config } from "dotenv";

config();

const configService = new ConfigService();

export default new DataSource({
    type: 'postgres',
    host: configService.get('DATABASE_HOST'),
    port: configService.get('DATABASE_PORT'),
    username: configService.get('DATABASE_USERNAME'),
    password: configService.get('DATABASE_PASSWORD'),
    database: configService.get('DATABASE_NAME'),
    entities: [Company, Transfer],
    migrations: ['src/shared/infrastruture/database/migrations/*.ts'],
    synchronize: false,
    logging: true,
});