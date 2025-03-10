import { Company } from '../../domain/entities/company.entity';

export interface CompanyRepository {
    create(company: Company): Promise<Company>;
    findByCuit(cuit: string): Promise<Company | null>;
    findByAdhesionDateRange(start: Date, end: Date): Promise<Company[]>;
    findAll(): Promise<Company[]>;
    findById(id: string): Promise<Company | null>;
}