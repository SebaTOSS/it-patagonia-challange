import { Inject, Injectable } from '@nestjs/common';
import { CompanyRepository } from '../../domain/ports/company.repository';
import { Company } from '../../domain/entities/company.entity';
import { DateUtils } from '../../../shared/utils/date.utils';
import { CompanyResponse } from '../dto/company.response';

@Injectable()
export class GetCompaniesAdheredUseCase {
    constructor(
        @Inject('COMPANY_REPOSITORY')
        private readonly repository: CompanyRepository,
        private readonly dateUtils: DateUtils,
    ) { }

    async execute(): Promise<CompanyResponse[]> {
        const { start, end } = this.dateUtils.getLastMonthRange();
        const companies = this.repository.findByAdhesionDateRange(start, end);

        return (await companies).map(this.mapToResponse);
    }

    private mapToResponse(company: any): CompanyResponse {
        return {
            id: company.id,
            cuit: company.cuit,
            name: company.name,
            adhesionDate: company.adhesionDate,
            createdAt: company.createdAt,
            updatedAt: company.updatedAt,
        };
    }
}