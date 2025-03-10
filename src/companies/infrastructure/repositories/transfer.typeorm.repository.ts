import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transfer, Company } from '../../domain';
import { TransferRepository } from '../../application/ports/transfer.repository';

@Injectable()
export class TransferTypeOrmRepository implements TransferRepository {
    constructor(
        @InjectRepository(Transfer)
        private repository: Repository<Transfer>,
    ) { }

    async findCompaniesWithTransfers(start: Date, end: Date): Promise<Company[]> {
        const transfers = await this.repository
            .createQueryBuilder('transfer')
            .innerJoinAndSelect('transfer.company', 'company')
            .where('transfer.date BETWEEN :start AND :end', { start, end })
            .getMany();

        const uniqueCompanies = new Map<string, Company>();
        transfers.forEach(transfer => {
            if (transfer.company && !uniqueCompanies.has(transfer.company.id)) {
                uniqueCompanies.set(transfer.company.id, transfer.company);
            }
        });

        return Array.from(uniqueCompanies.values());
    }

    async create(transfer: Transfer): Promise<Transfer> {
        return this.repository.save(transfer);
    }
}