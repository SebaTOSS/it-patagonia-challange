import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CompanyOrmEntity } from './company.orm-entity';

@Entity('transfers')
export class TransferOrmEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('decimal')
    amount: number;

    @Column({ name:'debit_account', type: 'text' })
    debitAccount: string;

    @Column({ name:'credit_account', type: 'text' })
    creditAccount: string;

    @Column({ type: 'date' })
    date: Date;

    @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @ManyToOne(() => CompanyOrmEntity)
    company: CompanyOrmEntity;
}