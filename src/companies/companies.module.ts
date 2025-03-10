import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyTypeOrmRepository, TransferTypeOrmRepository } from './infrastructure/database/repositories';
import { CompanyOrmEntity, TransferOrmEntity } from './infrastructure/database/entities';
import { CompaniesController } from './infrastructure/http/controllers/companies.controller';
import {
  CreateCompanyUseCase,
  GetCompaniesAdheredUseCase,
  GetCompaniesTransfersUseCase,
} from './application/use-cases';
import { DateUtils } from '../shared/utils/date.utils';

@Module({
  imports: [TypeOrmModule.forFeature([CompanyOrmEntity, TransferOrmEntity])],
  controllers: [CompaniesController],
  providers: [
    DateUtils,
    CompanyTypeOrmRepository,
    TransferTypeOrmRepository,
    {
      provide: 'COMPANY_REPOSITORY',
      useExisting: CompanyTypeOrmRepository,
    },
    {
      provide: 'TRANSFER_REPOSITORY',
      useExisting: TransferTypeOrmRepository,
    },
    {
      provide: CreateCompanyUseCase,
      useFactory: (companyRepo: CompanyTypeOrmRepository, dateUtils: DateUtils) =>
        new CreateCompanyUseCase(companyRepo, dateUtils),
      inject: ['COMPANY_REPOSITORY', DateUtils],
    },
    {
      provide: GetCompaniesAdheredUseCase,
      useFactory: (companyRepo: CompanyTypeOrmRepository, dateUtils: DateUtils) =>
        new GetCompaniesAdheredUseCase(companyRepo, dateUtils),
      inject: ['COMPANY_REPOSITORY', DateUtils],
    },
    {
      provide: GetCompaniesTransfersUseCase,
      useFactory: (transferRepo: TransferTypeOrmRepository, dateUtils: DateUtils) =>
        new GetCompaniesTransfersUseCase(transferRepo, dateUtils),
      inject: ['TRANSFER_REPOSITORY', DateUtils],
    }
  ],
  exports: [
    'COMPANY_REPOSITORY',
    'TRANSFER_REPOSITORY',
  ],
})
export class CompaniesModule { }