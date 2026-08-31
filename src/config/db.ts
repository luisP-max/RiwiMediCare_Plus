import { Sequelize } from 'sequelize';
import 'dotenv/config';

/**
 * Sequelize ORM instance configuration.
 * Maps application object models directly to the PostgreSQL relational database container.
 */
export const sequelize = new Sequelize(
    process.env.DB_NAME || 'riwicare_db',
    process.env.DB_USER || 'postgres',
    process.env.DB_PASSWORD || 'postgres',
    {
        host: process.env.DB_HOST || 'database',
        port: Number(process.env.DB_PORT) || 5432,
        dialect: 'postgres',
        logging: false, // Disables noisy SQL query logging in the development terminal
        define: {
            timestamps: true, // Automatically manages created_at and updated_at metadata columns
            underscored: true // Physically transforms camelCase model properties to snake_case in Docker
        }
    }
);

/**
 * Establishes and verifies the database connection lifecycle.
 * Synchronizes the structural definitions of all Sequelize models into physical PostgreSQL tables.
 */
export const ConnectDB = async (): Promise<void> => {
    try {
        // Test the database credentials and connection health
        await sequelize.authenticate();
        console.log('[Database] Native connection with Sequelize ORM established successfully.');
        
        // Drops old tables and forces a clean sync to implement the complete database schema
        await sequelize.sync({ force: true });
        console.log('[Database] Relational schema synchronization completed successfully.');
    } catch (error) {
        console.error('[Database Error] Critical connection failure in core infrastructure:', error);
        process.exit(1);
    }
};
