import { Inject, Injectable } from '@nestjs/common';
import { TransferRepository } from '../../domain/ports/transfer.repository';
import { CompanyResponse } from '../dto/company.response';
import { DateUtils } from '../../../shared/utils/date.utils';

@Injectable()
export class GetCompaniesTransfersUseCase {
    constructor(
        @Inject('TRANSFER_REPOSITORY')
        private readonly transferRepository: TransferRepository,
        private readonly dateUtils: DateUtils,
    ) { }

    async execute(): Promise<CompanyResponse[]> {
        const { start, end } = this.dateUtils.getLastMonthRange();
        const companies = await this.transferRepository.findCompaniesWithTransfers(start, end);
        
        return companies.map(this.mapToResponse);
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