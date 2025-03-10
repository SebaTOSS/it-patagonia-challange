import { Module } from '@nestjs/common';
import { SharedModule } from './shared/shared.module';
import { CompaniesModule } from './companies/companies.module';

@Module({
  imports: [
    SharedModule,
    CompaniesModule
  ],
})
export class AppModule { }