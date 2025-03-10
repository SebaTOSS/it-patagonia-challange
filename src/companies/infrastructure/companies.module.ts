import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from '../domain/company.entity';
import { Transfer } from '../domain/transfer.entity';
import { CompaniesController } from './controllers/companies.controller';
import { CompanyTypeOrmRepository } from './repositories/company.typeorm.repository';
import { TransferTypeOrmRepository } from './repositories/transfer.typeorm.repository';
import { CompanyRepository } from '../application/ports/company.repository';
import { TransferRepository } from '../application/ports/transfer.repository';
import {
  CreateCompanyUseCase,
  GetCompaniesAdheredUseCase,
  GetCompaniesTransfersUseCase,
} from '../application/use-cases';
import { DateUtils } from '../../shared/utils/date.utils';

@Module({
  imports: [
    TypeOrmModule.forFeature([Company, Transfer]),
  ],
  controllers: [CompaniesController],
  providers: [
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
      useFactory: (
        companyRepo: CompanyRepository,
        dateUtils: DateUtils
      ) => new CreateCompanyUseCase(companyRepo, dateUtils),
      inject: ['COMPANY_REPOSITORY', DateUtils],
    },
    {
      provide: GetCompaniesAdheredUseCase,
      useFactory: (
        companyRepo: CompanyRepository,
        dateUtils: DateUtils
      ) => new GetCompaniesAdheredUseCase(companyRepo, dateUtils),
      inject: ['COMPANY_REPOSITORY', DateUtils],
    },
    {
      provide: GetCompaniesTransfersUseCase,
      useFactory: (
        transferRepo: TransferRepository,
        dateUtils: DateUtils
      ) => new GetCompaniesTransfersUseCase(transferRepo, dateUtils),
      inject: ['TRANSFER_REPOSITORY', DateUtils],
    },
    DateUtils,
  ],
  exports: [
    'COMPANY_REPOSITORY',
    'TRANSFER_REPOSITORY',
  ],
})
export class CompaniesModule { }