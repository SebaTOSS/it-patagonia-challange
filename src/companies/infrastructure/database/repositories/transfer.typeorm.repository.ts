import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transfer, Company } from '../../../domain/entities';
import { TransferRepository } from '../../../domain/ports/transfer.repository';
import { TransferOrmEntity } from '../entities';

@Injectable()
export class TransferTypeOrmRepository implements TransferRepository {
    constructor(
        @InjectRepository(TransferOrmEntity)
        private repository: Repository<TransferOrmEntity>,
    ) { }

    async create(transfer: Transfer): Promise<Transfer> {
        const ormEntity = this.repository.create(transfer);
        const saved = await this.repository.save(ormEntity);
        
        return this.toDomain(saved);
    }

    async findCompaniesWithTransfers(start: Date, end: Date): Promise<Company[]> {
        const transfers = await this.repository
            .createQueryBuilder('transfer')
            .innerJoinAndSelect('transfer.company', 'company')
            .where('transfer.date BETWEEN :start AND :end', { start, end })
            .getMany();

        const companiesMap = new Map<string, Company>();
        transfers.forEach((transfer) => {
            const company = this.toDomain(transfer).company;
            companiesMap.set(company.id, company);
        });

        return Array.from(companiesMap.values());
    }

    private toDomain(ormEntity: TransferOrmEntity): Transfer {
        return {
            id: ormEntity.id,
            amount: ormEntity.amount,
            debitAccount: ormEntity.debitAccount,
            creditAccount: ormEntity.creditAccount,
            date: ormEntity.date,
            company: {
                id: ormEntity.company.id,
                cuit: ormEntity.company.cuit,
                name: ormEntity.company.name,
                adhesionDate: ormEntity.company.adhesionDate,
                createdAt: ormEntity.company.createdAt,
                updatedAt: ormEntity.company.updatedAt,
            },
            createdAt: ormEntity.createdAt,
            updatedAt: ormEntity.updatedAt,
        };
    }
}