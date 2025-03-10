import { Injectable } from '@nestjs/common';
import { Repository, Between } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from '../../domain/company.entity';
import { CompanyRepository } from '../../application/ports/company.repository';

@Injectable()
export class CompanyTypeOrmRepository implements CompanyRepository {
    constructor(
        @InjectRepository(Company)
        private repository: Repository<Company>,
    ) { }

    async create(company: Company): Promise<Company> {
        return this.repository.save(company);
    }

    async findByCuit(cuit: string): Promise<Company | null> {
        return this.repository.findOneBy({ cuit });
    }

    async findByAdhesionDateRange(start: Date, end: Date): Promise<Company[]> {
        return this.repository.find({
            where: { adhesionDate: Between(start, end) },
        });
    }

    async findAll(): Promise<Company[]> {
        return this.repository.find();
    }

    async findById(id: string): Promise<Company | null> {
        return this.repository.findOneBy({ id });
    }
}