import { Test, TestingModule } from '@nestjs/testing';
import { GetCompaniesTransfersUseCase } from './get-companies-transfers.use-case';
import { TransferRepository } from '../ports/transfer.repository';
import { DateUtils } from '../../../shared/utils/date.utils';

describe('GetCompaniesTransfersUseCase', () => {
    let useCase: GetCompaniesTransfersUseCase;
    let mockTransferRepo: jest.Mocked<TransferRepository>;
    let mockDateUtils: jest.Mocked<DateUtils>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                GetCompaniesTransfersUseCase,
                {
                    provide: 'TRANSFER_REPOSITORY',
                    useValue: {
                        findCompaniesWithTransfers: jest.fn().mockResolvedValue([]),
                    },
                },
                {
                    provide: DateUtils,
                    useValue: {
                        getLastMonthRange: jest.fn().mockReturnValue({
                            start: new Date('2023-08-01'),
                            end: new Date('2023-08-31'),
                        }),
                    },
                },
            ],
        }).compile();

        useCase = module.get<GetCompaniesTransfersUseCase>(GetCompaniesTransfersUseCase);
        mockTransferRepo = module.get('TRANSFER_REPOSITORY');
        mockDateUtils = module.get(DateUtils);
    });

    it('should return companies with transfers', async () => {
        const createdAt = new Date();
        const updatedAt = new Date();
        const mockCompanies = [{
            id: '1',
            cuit: '30123456789',
            name: 'Test Company',
            adhesionDate: new Date('2023-01-01'),
            createdAt,
            updatedAt,
        }];

        mockTransferRepo.findCompaniesWithTransfers.mockResolvedValue(mockCompanies);

        const result = await useCase.execute();

        expect(result).toEqual([{
            id: '1',
            cuit: '30123456789',
            name: 'Test Company',
            adhesionDate: new Date('2023-01-01'),
            createdAt,
            updatedAt,
        }]);
        expect(mockDateUtils.getLastMonthRange).toHaveBeenCalled();
    });
});