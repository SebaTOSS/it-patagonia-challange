import { Transfer, Company } from '../../domain';

export interface TransferRepository {
    findCompaniesWithTransfers(start: Date, end: Date): Promise<Company[]>;
    create(transfer: Transfer): Promise<Transfer>;
}