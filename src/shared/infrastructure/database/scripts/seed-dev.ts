import dataSource from '../data-source';
import { CompanyOrmEntity } from '../../../../companies/infrastructure/database/entities/company.orm-entity';
import { TransferOrmEntity } from '../../../../companies/infrastructure/database/entities/transfer.orm-entity';

async function seedDevDatabase() {
  try {
    await dataSource.initialize();
    console.log('Connected to the database.');

    const companyRepo = dataSource.getRepository(CompanyOrmEntity);
    const transferRepo = dataSource.getRepository(TransferOrmEntity);

    const companies = [
      {
        cuit: '30-12345678-9',
        name: 'Tech Solutions S.A.',
        adhesionDate: new Date('2023-01-15'),
      },
      {
        cuit: '20-98765432-1',
        name: 'Global Trading SRL',
        adhesionDate: new Date('2023-03-20'),
      },
      {
        cuit: '33-55555555-5',
        name: 'Innovate Corp',
        adhesionDate: new Date('2023-06-10'),
      },
    ];

    const savedCompanies = await companyRepo.save(companies);
    console.log('Comapanies created: ', savedCompanies.length);

    const transfers = [
      {
        amount: 5000.75,
        debitAccount: 'ACC-001',
        creditAccount: 'ACC-002',
        date: new Date('2023-07-01'),
        company: savedCompanies[0], // Tech Solutions
      },
      {
        amount: 12000.00,
        debitAccount: 'ACC-003',
        creditAccount: 'ACC-004',
        date: new Date('2023-07-05'),
        company: savedCompanies[1], // Global Trading
      },
      {
        amount: 750.25,
        debitAccount: 'ACC-005',
        creditAccount: 'ACC-006',
        date: new Date('2023-07-10'),
        company: savedCompanies[2], // Innovate Corp
      },
      {
        amount: 3000.50,
        debitAccount: 'ACC-007',
        creditAccount: 'ACC-001',
        date: new Date('2023-07-15'),
        company: savedCompanies[0], // Tech Solutions
      },
    ];

    const savedTransfers = await transferRepo.save(transfers);
    console.log('Transfers created:', savedTransfers.length);

    console.log('Database seeded successfully.');
  } catch (error) {
    console.error('Error during seed: ', error);
    throw error;
  } finally {
    if (dataSource.isInitialized) {
      await dataSource.destroy();
      console.log('Connection closed.');
    }
  }
}

seedDevDatabase().catch((err) => {
  console.error('Script ended with error: ', err);
  process.exit(1);
});