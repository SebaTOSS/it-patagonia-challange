import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('companies')
export class CompanyOrmEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    cuit: string;

    @Column()
    name: string;

    @Column({ name: 'adhesion_date', type: 'date' })
    adhesionDate: Date;

    @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;
}