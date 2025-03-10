import { Test, TestingModule } from '@nestjs/testing';
import { CompaniesController } from './companies.controller';
import { GetCompaniesAdheredUseCase, CreateCompanyUseCase, GetCompaniesTransfersUseCase } from '../../../application/use-cases';
import { CreateCompanyDto } from '../../../application/dto/create-company.dto';

describe('CompaniesController', () => {
    let controller: CompaniesController;
    let createCompanyUseCase: CreateCompanyUseCase;
    let getCompaniesAdheredUseCase: GetCompaniesAdheredUseCase;
    let getCompaniesTransfersUseCase: GetCompaniesTransfersUseCase;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [CompaniesController],
            providers: [
                {
                    provide: GetCompaniesAdheredUseCase,
                    useValue: { execute: jest.fn().mockResolvedValue([]) },
                },
                {
                    provide: CreateCompanyUseCase,
                    useValue: { execute: jest.fn().mockResolvedValue({}) },
                },
                {
                    provide: GetCompaniesTransfersUseCase,
                    useValue: { execute: jest.fn().mockResolvedValue([]) },
                },
            ],
        }).compile();

        controller = module.get<CompaniesController>(CompaniesController);
        createCompanyUseCase = module.get<CreateCompanyUseCase>(CreateCompanyUseCase);
        getCompaniesAdheredUseCase = module.get<GetCompaniesAdheredUseCase>(GetCompaniesAdheredUseCase);
        getCompaniesTransfersUseCase = module.get<GetCompaniesTransfersUseCase>(GetCompaniesTransfersUseCase);
    });

    describe('getAdheredLastMonth', () => {
        it('should return companies', async () => {
            const result = await controller.getAdheredLastMonth();
            expect(result).toEqual([]);
            expect(getCompaniesAdheredUseCase.execute).toHaveBeenCalled();
        });
    });

    describe('getCompaniesWithTransfers', () => {
        it('should return companies', async () => {
            const result = await controller.getCompaniesWithTransfers();
            expect(result).toEqual([]);
            expect(getCompaniesTransfersUseCase.execute).toHaveBeenCalled();
        });
    });

    describe('createCompany', () => {
        it('should create a company', async () => {
            const dto: CreateCompanyDto = {
                cuit: '30-12345678-9',
                name: 'Test Company',
            };
            const result = await controller.createCompany(dto);
            expect(result).toEqual({});
            expect(createCompanyUseCase.execute).toHaveBeenCalled();
        });
    });
});