import { Test, TestingModule } from '@nestjs/testing';
import { CreateCompanyUseCase } from './create-company.use-case';
import { CompanyRepository } from '../../domain/ports/company.repository';
import { DateUtils } from '../../../shared/utils/date.utils';
import { ConflictException } from '@nestjs/common';

describe('CreateCompanyUseCase', () => {
    let useCase: CreateCompanyUseCase;
    let mockCompanyRepository: jest.Mocked<CompanyRepository>;
    let mockDateUtils: jest.Mocked<DateUtils>;

    const mockDate = new Date('2023-09-20');
    const mockCompany: any = {
        id: 'uuid',
        cuit: '30123456789',
        name: 'Test Company',
        adhesionDate: mockDate
    };

    const mockDto = {
        cuit: '30-12345678-9',
        name: 'Test Company'
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CreateCompanyUseCase,
                {
                    provide: 'COMPANY_REPOSITORY',
                    useValue: {
                        findByCuit: jest.fn().mockResolvedValue(null),
                        create: jest.fn().mockResolvedValue(mockCompany)
                    }
                },
                {
                    provide: DateUtils,
                    useValue: {
                        getCurrentDate: jest.fn().mockReturnValue(mockDate)
                    }
                }
            ]
        }).compile();

        useCase = module.get<CreateCompanyUseCase>(CreateCompanyUseCase);
        mockCompanyRepository = module.get('COMPANY_REPOSITORY');
        mockDateUtils = module.get(DateUtils);
    });

    it('should be defined', () => {
        expect(useCase).toBeDefined();
    });

    describe('execute', () => {
        it('should create a new company with formatted CUIT', async () => {
            const result = await useCase.execute(mockDto);

            expect(mockCompanyRepository.findByCuit).toHaveBeenCalledWith('30123456789');
            expect(mockCompanyRepository.create).toHaveBeenCalledWith({
                cuit: '30123456789',
                name: 'Test Company',
                adhesionDate: mockDate
            });

            expect(result).toEqual({
                id: 'uuid',
                cuit: '30-12345678-9',
                name: 'Test Company',
                adhesionDate: mockDate
            });
        });

        it('should throw ConflictException for duplicate CUIT', async () => {
            mockCompanyRepository.findByCuit.mockResolvedValueOnce(mockCompany);

            await expect(useCase.execute(mockDto)).rejects.toThrow(ConflictException);
        });

        it('should normalize CUIT without hyphens', async () => {
            const dtoWithVariousFormats = {
                cuit: '30-1234-5678-9',
                name: 'Test'
            };

            await useCase.execute(dtoWithVariousFormats);
            expect(mockCompanyRepository.findByCuit).toHaveBeenCalledWith('30123456789');
        });

        it('should use current date from DateUtils', async () => {
            await useCase.execute(mockDto);
            expect(mockDateUtils.getCurrentDate).toHaveBeenCalled();
        });

        it('should propagate repository errors', async () => {
            const error = new Error('Database error');
            mockCompanyRepository.create.mockRejectedValueOnce(error);

            await expect(useCase.execute(mockDto)).rejects.toThrow(error);
        });
    });

    describe('cuit formatting', () => {
        it('should format CUIT correctly', () => {
            const testCases = [
                { input: '30123456789', output: '30-12345678-9' },
                { input: '20111222333', output: '20-11122233-3' },
                { input: '27-12345678-9', output: '27-12345678-9' }
            ];

            testCases.forEach(({ input, output }) => {
                expect(useCase['formatCuit'](input)).toBe(output);
            });
        });
    });
});