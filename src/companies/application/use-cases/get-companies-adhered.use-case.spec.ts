import { Test, TestingModule } from '@nestjs/testing';
import { GetCompaniesAdheredUseCase } from './get-companies-adhered.use-case';
import { CompanyRepository } from '../ports/company.repository';
import { DateUtils } from '../../../shared/utils/date.utils';
import { Company } from '../../domain/company.entity';

describe('GetCompaniesAdheredUseCase', () => {
    let useCase: GetCompaniesAdheredUseCase;
    let mockCompanyRepository: jest.Mocked<CompanyRepository>;
    let mockDateUtils: jest.Mocked<DateUtils>;

    const mockCompanies: Company[] = [{
        id: '1',
        cuit: '30-12345678-9',
        name: 'Test Company',
        adhesionDate: new Date('2023-08-01'),
        createdAt: new Date(),
        updatedAt: new Date(),
    }];

    const lastMonthRange = {
        start: new Date('2023-08-01'),
        end: new Date('2023-08-31')
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                GetCompaniesAdheredUseCase,
                {
                    provide: 'COMPANY_REPOSITORY',
                    useValue: {
                        findByAdhesionDateRange: jest.fn().mockResolvedValue(mockCompanies),
                    },
                },
                {
                    provide: DateUtils,
                    useValue: {
                        getLastMonthRange: jest.fn().mockReturnValue(lastMonthRange),
                    },
                },
            ],
        }).compile();

        useCase = module.get<GetCompaniesAdheredUseCase>(GetCompaniesAdheredUseCase);
        mockCompanyRepository = module.get('COMPANY_REPOSITORY');
        mockDateUtils = module.get(DateUtils);
    });

    it('should be defined', () => {
        expect(useCase).toBeDefined();
    });

    describe('execute', () => {
        it('should call DateUtils.getLastMonthRange', async () => {
            await useCase.execute();
            expect(mockDateUtils.getLastMonthRange).toHaveBeenCalled();
        });

        it('should call repository with correct date range', async () => {
            await useCase.execute();
            expect(mockCompanyRepository.findByAdhesionDateRange)
                .toHaveBeenCalledWith(lastMonthRange.start, lastMonthRange.end);
        });

        it('should return companies from repository', async () => {
            const result = await useCase.execute();
            expect(result).toEqual(mockCompanies);
        });

        it('should handle empty results', async () => {
            mockCompanyRepository.findByAdhesionDateRange.mockResolvedValueOnce([]);
            const result = await useCase.execute();
            expect(result).toEqual([]);
        });

        it('should propagate repository errors', async () => {
            const error = new Error('Database error');
            mockCompanyRepository.findByAdhesionDateRange.mockRejectedValueOnce(error);
            await expect(useCase.execute()).rejects.toThrow(error);
        });
    });
});