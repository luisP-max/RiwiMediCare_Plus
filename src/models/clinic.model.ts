import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db.js';

/**
 * Clinic Model representing the 'clinics' table in PostgreSQL.
 * Manages healthcare center data records and enforcement of unique corporate identities.
 */
export class Clinic extends Model {
    public id!: string;
    public nit!: string;
    public name!: string;
    public address!: string;
    public managerName!: string;
    public status!: 'active' | 'deleted';
}

Clinic.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        nit: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true, // Prevents duplicate clinic rows based on their corporate NIT tax code
        },
        name: {
            type: DataTypes.STRING(150),
            allowNull: false,
        },
        address: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        managerName: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM('active', 'deleted'),
            allowNull: false,
            defaultValue: 'active', // All clinics are initialized with an active status by default
        },
    },
    {
        sequelize,
        modelName: 'Clinic',
        tableName: 'clinics', // Pluralized table database footprint mapping
    }
);
