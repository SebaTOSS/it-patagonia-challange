import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateCompanyDto } from '../../application/dto/create-company.dto';
import { CompanyResponse } from '../../application/dto/company.response';
import {
    GetCompaniesAdheredUseCase,
    CreateCompanyUseCase,
    GetCompaniesTransfersUseCase
} from '../../application/use-cases';

@ApiTags('Companies')
@Controller('companies')
export class CompaniesController {
    constructor(
        private readonly createCompanyUseCase: CreateCompanyUseCase,
        private readonly getCompaniesAdheredUseCase: GetCompaniesAdheredUseCase,
        private readonly getCompaniesTransfersUseCase: GetCompaniesTransfersUseCase,
    ) { }

    @Post()
    @ApiOperation({ summary: 'Creates a new company' })
    @ApiResponse({
        status: 201,
        description: 'The company has been successfully created',
        type: CompanyResponse
    })
    async createCompany(@Body() dto: CreateCompanyDto): Promise<CompanyResponse> {
        return this.createCompanyUseCase.execute(dto);
    }

    @Get('adhered-last-month')
    @ApiOperation({ summary: 'Company adhered in last month' })
    @ApiResponse({ type: [CompanyResponse] })
    async getAdheredLastMonth(): Promise<CompanyResponse[]> {
        return this.getCompaniesAdheredUseCase.execute();
    }

    @Get('transfers-last-month')
    @ApiOperation({ summary: 'Companies with transfers in the last month' })
    @ApiResponse({ type: [CompanyResponse] })
    async getCompaniesWithTransfers(): Promise<CompanyResponse[]> {
        return this.getCompaniesTransfersUseCase.execute();
    }
}