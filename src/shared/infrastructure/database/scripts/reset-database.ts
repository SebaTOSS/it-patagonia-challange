import dataSource from '../data-source';
import * as readline from 'readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

function askQuestion(question: string): Promise<string> {
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            resolve(answer);
        });
    });
}

async function resetDatabase() {
    try {
        const environment = process.env.NODE_ENV || 'development';
        console.log(`Current environment: ${environment}`);
        const confirmReset = await askQuestion(
            `Are you sure to delete the database for "${environment}"? (yes/no): `
        );

        if (confirmReset.toLowerCase() !== 'yes') {
            console.log('Operation canceled.');
            rl.close();

            return;
        }

        if (environment === 'production') {
            const confirmProd = await askQuestion(
                '¡ATTENTION! You are in PRODUCTION. Do you really want to delete ALL data? (yes/no): '
            );
            if (confirmProd.toLowerCase() !== 'yes') {
                console.log('Operación cancelada.');
                rl.close();

                return;
            }
        }

        await dataSource.initialize();
        console.log('Connected to the database.');

        const entities = dataSource.entityMetadatas;

        await dataSource.query('SET CONSTRAINTS ALL DEFERRED;');

        for (const entity of entities) {
            const tableName = entity.tableName;
            console.log(`Removing table: ${tableName}`);
            await dataSource.query(`DROP TABLE IF EXISTS "${tableName}" CASCADE;`);
        }

        const migrationsTable = dataSource.options.migrationsTableName || 'migrations';
        console.log(`Removing migrations table: ${migrationsTable}`);
        await dataSource.query(`DROP TABLE IF EXISTS "${migrationsTable}" CASCADE;`);

        console.log('Successfully reset the database.');
    } catch (error) {
        console.error('Error on reset the database error: ', error);
        throw error;
    } finally {
        if (dataSource.isInitialized) {
            await dataSource.destroy();
            console.log('Database connection closed.');
        }
    }
}

resetDatabase().catch((err) => {
    console.error('Execution error: ', err);
    process.exit(1);
});