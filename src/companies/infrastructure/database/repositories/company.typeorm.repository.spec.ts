import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { CompanyTypeOrmRepository } from './company.typeorm.repository';
import { Company } from '../../../domain/entities/company.entity';

describe('CompanyTypeOrmRepository', () => {
    let repository: CompanyTypeOrmRepository;
    let typeOrmRepo: jest.Mocked<Repository<Company>>;

    const mockCompany: Company = {
        id: 'uuid',
        cuit: '30123456789',
        name: 'Test Company',
        adhesionDate: new Date('2023-01-01'),
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CompanyTypeOrmRepository,
                {
                    provide: getRepositoryToken(Company),
                    useValue: {
                        save: jest.fn(),
                        findOneBy: jest.fn(),
                        find: jest.fn(),
                    },
                },
            ],
        }).compile();

        repository = module.get<CompanyTypeOrmRepository>(CompanyTypeOrmRepository);
        typeOrmRepo = module.get<Repository<Company>>(getRepositoryToken(Company)) as jest.Mocked<Repository<Company>>;
    });

    it('should be defined', () => {
        expect(repository).toBeDefined();
    });

    describe('create', () => {
        it('should save and return a company', async () => {
            typeOrmRepo.save.mockResolvedValue(mockCompany);

            const result = await repository.create(mockCompany);

            expect(typeOrmRepo.save).toHaveBeenCalledWith(mockCompany);
            expect(result).toEqual(mockCompany);
        });

        it('should propagate database errors', async () => {
            const error = new Error('Database error');
            typeOrmRepo.save.mockRejectedValue(error);

            await expect(repository.create(mockCompany)).rejects.toThrow(error);
        });
    });

    describe('findByCuit', () => {
        it('should find company by cuit', async () => {
            typeOrmRepo.findOneBy.mockResolvedValue(mockCompany);

            const result = await repository.findByCuit('30123456789');

            expect(typeOrmRepo.findOneBy).toHaveBeenCalledWith({ cuit: '30123456789' });
            expect(result).toEqual(mockCompany);
        });

        it('should return null if not found', async () => {
            typeOrmRepo.findOneBy.mockResolvedValue(null);

            const result = await repository.findByCuit('invalid-cuit');

            expect(result).toBeNull();
        });
    });

    describe('findByAdhesionDateRange', () => {
        const startDate = new Date('2023-01-01');
        const endDate = new Date('2023-01-31');

        it('should find companies in date range', async () => {
            typeOrmRepo.find.mockResolvedValue([mockCompany]);

            const result = await repository.findByAdhesionDateRange(startDate, endDate);

            expect(typeOrmRepo.find).toHaveBeenCalledWith({
                where: { adhesionDate: Between(startDate, endDate) }
            });
            expect(result).toEqual([mockCompany]);
        });

        it('should return empty array if no matches', async () => {
            typeOrmRepo.find.mockResolvedValue([]);

            const result = await repository.findByAdhesionDateRange(startDate, endDate);

            expect(result).toEqual([]);
        });
    });

    describe('findAll', () => {
        it('should return all companies', async () => {
            typeOrmRepo.find.mockResolvedValue([mockCompany]);

            const result = await repository.findAll();

            expect(typeOrmRepo.find).toHaveBeenCalledWith();
            expect(result).toEqual([mockCompany]);
        });
    });

    describe('findById', () => {
        it('should find company by id', async () => {
            typeOrmRepo.findOneBy.mockResolvedValue(mockCompany);

            const result = await repository.findById('uuid');

            expect(typeOrmRepo.findOneBy).toHaveBeenCalledWith({ id: 'uuid' });
            expect(result).toEqual(mockCompany);
        });
    });
});