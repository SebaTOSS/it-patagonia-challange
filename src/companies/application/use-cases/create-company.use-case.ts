import { Injectable, ConflictException, Inject } from '@nestjs/common';
import { CompanyRepository } from '../ports/company.repository';
import { CreateCompanyDto } from '../dto/create-company.dto';
import { Company } from '../../domain/company.entity';
import { CompanyResponse } from '../dto/company.response';
import { DateUtils } from '../../../shared/utils/date.utils';

@Injectable()
export class CreateCompanyUseCase {
    constructor(
        @Inject('COMPANY_REPOSITORY')
        private readonly companyRepository: CompanyRepository,
        private readonly dateUtils: DateUtils,
    ) { }

    /**
     * Executes the use case
     * @param dto Input data
     * @returns CompanyResponse
     * @throws ConflictException if the CUIT is already in use
     */
    async execute(dto: CreateCompanyDto): Promise<CompanyResponse> {
        await this.validateExistingCuit(dto.cuit);

        const company = this.mapDtoToEntity(dto);
        const createdCompany = await this.companyRepository.create(company);

        return this.mapEntityToResponse(createdCompany);
    }

    /**
     * Validate that CUIT is not already in use
     * @param cuit CUIT to validate
     * @throws ConflictException if the CUIT is already in use
     */
    private async validateExistingCuit(cuit: string): Promise<void> {
        const formattedCuit = cuit.replace(/-/g, '');
        const existingCompany = await this.companyRepository.findByCuit(formattedCuit);
        if (existingCompany) {
            throw new ConflictException('CUIT already in use');
        }
    }

    /**
     * Maps the DTO to Company entity
     * @param dto CreateCompanyDto
     * @returns Company entity
     */
    private mapDtoToEntity(dto: CreateCompanyDto): Company {
        const company = new Company();
        company.cuit = dto.cuit.replace(/-/g, '');
        company.name = dto.name;
        company.adhesionDate = this.dateUtils.getCurrentDate();
        
        return company;
    }

    /**
     * Maps the Company entity to CompanyResponse
     * @param entity Company entity
     * @returns CompanyResponse
     */
    private mapEntityToResponse(entity: Company): CompanyResponse {
        return {
            id: entity.id,
            cuit: this.formatCuit(entity.cuit),
            name: entity.name,
            adhesionDate: entity.adhesionDate,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        };
    }

    /**
     * Formats the CUIT to display it correctly
     * @param cuit CUIT without format
     * @returns CUIT with format
     */
    private formatCuit(cuit: string): string {
        return cuit.replace(/(\d{2})(\d{8})(\d{1})/, '$1-$2-$3');
    }
}