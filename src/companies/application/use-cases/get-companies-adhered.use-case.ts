import { Inject, Injectable } from '@nestjs/common';
import { CompanyRepository } from '../ports/company.repository';
import { Company } from '../../domain/company.entity';
import { DateUtils } from '../../../shared/utils/date.utils';

@Injectable()
export class GetCompaniesAdheredUseCase {
    constructor(
        @Inject('COMPANY_REPOSITORY')
        private readonly repository: CompanyRepository,
        private readonly dateUtils: DateUtils,
    ) { }

    async execute(): Promise<Company[]> {
        const { start, end } = this.dateUtils.getLastMonthRange();

        return this.repository.findByAdhesionDateRange(start, end);
    }
}