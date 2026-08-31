import { Sequelize } from 'sequelize';
import 'dotenv/config';

export const sequelize = new Sequelize(
    process.env.DB_NAME || 'riwicare_db',
    process.env.DB_USER || 'postgres',
    process.env.DB_PASSWORD || 'postgres',
    {
        host: process.env.DB_HOST || 'database',
        port: Number(process.env.DB_PORT) || 5432,
        dialect: 'postgres',
        logging: false,
        define: {
            timestamps: true,
            underscored: true
        }
    }
);

export const ConnectDB = async (): Promise<void> => {
    try {
        await sequelize.authenticate();
        console.log('[Database] Native connection with Sequelize ORM established successfully.');
        
        await sequelize.sync({ force: true });
        console.log('[Database] Relational schema synchronization completed successfully.');
    } catch (error) {
        console.error('[Database Error] Critical connection failure in core infrastructure:', error);
        process.exit(1);
    }
};
