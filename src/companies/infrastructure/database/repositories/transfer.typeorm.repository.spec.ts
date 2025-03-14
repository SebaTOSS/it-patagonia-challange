import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { TransferTypeOrmRepository } from './transfer.typeorm.repository';
import { Transfer, Company } from '../../../domain/entities';
import { TransferOrmEntity } from '../entities';

describe('TransferTypeOrmRepository', () => {
    let repository: TransferTypeOrmRepository;
    let typeOrmRepo: jest.Mocked<Repository<TransferOrmEntity>>;

    const mockCompany: Company = {
        id: 'company-uuid',
        cuit: '30123456789',
        name: 'Test Company',
        adhesionDate: new Date('2023-01-01'),
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    const mockTransferOrm: TransferOrmEntity = {
        id: 'transfer-uuid',
        amount: 1000,
        debitAccount: 'ACC-001',
        creditAccount: 'ACC-002',
        date: new Date('2023-09-01'),
        company: mockCompany as any,
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    const mockTransfer: Transfer = {
        id: 'transfer-uuid',
        amount: 1000,
        debitAccount: 'ACC-001',
        creditAccount: 'ACC-002',
        date: new Date('2023-09-01'),
        company: mockCompany,
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TransferTypeOrmRepository,
                {
                    provide: getRepositoryToken(TransferOrmEntity),
                    useValue: {
                        create: jest.fn().mockReturnValue(mockTransferOrm),
                        save: jest.fn(),
                        createQueryBuilder: jest.fn(() => ({
                            innerJoinAndSelect: jest.fn().mockReturnThis(),
                            where: jest.fn().mockReturnThis(),
                            getMany: jest.fn().mockResolvedValue([mockTransferOrm]),
                        })),
                    },
                },
            ],
        }).compile();

        repository = module.get<TransferTypeOrmRepository>(TransferTypeOrmRepository);
        typeOrmRepo = module.get(getRepositoryToken(TransferOrmEntity)) as jest.Mocked<Repository<TransferOrmEntity>>;
    });

    it('should be defined', () => {
        expect(repository).toBeDefined();
    });

    describe('findCompaniesWithTransfers', () => {
        const startDate = new Date('2023-09-01');
        const endDate = new Date('2023-09-30');

        it('should return unique companies with transfers in date range', async () => {
            const result = await repository.findCompaniesWithTransfers(startDate, endDate);

            expect(typeOrmRepo.createQueryBuilder).toHaveBeenCalledWith('transfer');
            expect(result).toEqual([mockCompany]);
        });

        it('should handle multiple transfers from same company', async () => {
            const mockTransfers = [
                { ...mockTransferOrm, id: 't1' },
                { ...mockTransferOrm, id: 't2' },
            ];

            const queryBuilderMock = {
                innerJoinAndSelect: jest.fn().mockReturnThis(),
                where: jest.fn().mockReturnThis(),
                getMany: jest.fn().mockResolvedValue(mockTransfers),
            } as unknown as SelectQueryBuilder<TransferOrmEntity>;

            jest.spyOn(typeOrmRepo, 'createQueryBuilder').mockReturnValue(queryBuilderMock);

            const result = await repository.findCompaniesWithTransfers(startDate, endDate);

            expect(result.length).toBe(1);
            expect(result[0].id).toBe('company-uuid');
        });

        it('should return empty array if no transfers found', async () => {
            const queryBuilderMock = {
                innerJoinAndSelect: jest.fn().mockReturnThis(),
                where: jest.fn().mockReturnThis(),
                getMany: jest.fn().mockResolvedValue([]),
            } as unknown as SelectQueryBuilder<TransferOrmEntity>;

            jest.spyOn(typeOrmRepo, 'createQueryBuilder').mockReturnValue(queryBuilderMock);

            const result = await repository.findCompaniesWithTransfers(startDate, endDate);
            expect(result).toEqual([]);
        });

        it('should filter by date range', async () => {
            const mockTransfers = [
                { ...mockTransferOrm, id: 't1' },
                { ...mockTransferOrm, id: 't2' },
            ];

            const mockQueryBuilder = {
                innerJoinAndSelect: jest.fn().mockReturnThis(),
                where: jest.fn().mockReturnThis(),
                getMany: jest.fn().mockResolvedValue(mockTransfers),
            } as unknown as SelectQueryBuilder<TransferOrmEntity>;

            jest.spyOn(typeOrmRepo, 'createQueryBuilder').mockReturnValue(mockQueryBuilder);

            await repository.findCompaniesWithTransfers(startDate, endDate);

            expect(mockQueryBuilder.where).toHaveBeenCalledWith(
                'transfer.date BETWEEN :start AND :end',
                { start: startDate, end: endDate }
            );
        });
    });

    describe('create', () => {
        it('should save and return a transfer', async () => {
            typeOrmRepo.save.mockResolvedValue(mockTransferOrm);

            const result = await repository.create(mockTransfer);

            expect(typeOrmRepo.create).toHaveBeenCalledWith(mockTransfer);
            expect(typeOrmRepo.save).toHaveBeenCalledWith(mockTransferOrm);
            expect(result).toEqual(mockTransfer);
        });

        it('should propagate database errors', async () => {
            const error = new Error('Database error');
            typeOrmRepo.save.mockRejectedValue(error);

            await expect(repository.create(mockTransfer)).rejects.toThrow(error);
        });
    });
});