import { Injectable } from '@nestjs/common';
import { Repository, Between } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CompanyOrmEntity } from '../entities/company.orm-entity';
import { CompanyRepository } from '../../../domain/ports/company.repository';
import { Company } from '../../../domain/entities/company.entity';

@Injectable()
export class CompanyTypeOrmRepository implements CompanyRepository {
    constructor(
        @InjectRepository(CompanyOrmEntity)
        private repository: Repository<CompanyOrmEntity>,
    ) { }

    async create(company: Company): Promise<CompanyOrmEntity> {
        return this.repository.save(company);
    }

    async findByCuit(cuit: string): Promise<CompanyOrmEntity | null> {
        return this.repository.findOneBy({ cuit });
    }

    async findByAdhesionDateRange(start: Date, end: Date): Promise<CompanyOrmEntity[]> {
        return this.repository.find({
            where: { adhesionDate: Between(start, end) },
        });
    }

    async findAll(): Promise<CompanyOrmEntity[]> {
        return this.repository.find();
    }

    async findById(id: string): Promise<CompanyOrmEntity | null> {
        return this.repository.findOneBy({ id });
    }
}