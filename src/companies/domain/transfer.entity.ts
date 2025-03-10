import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Company } from './company.entity';

@Entity()
export class Transfer {
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

    @ManyToOne(() => Company)
    company: Company;
}