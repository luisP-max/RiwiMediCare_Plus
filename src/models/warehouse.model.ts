import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db.js';

/**
 * Warehouse Model representing the 'warehouses' table in PostgreSQL.
 * Manages supply storage facilities used to fulfill clinic medical supply requests.
 */
export class Warehouse extends Model {
    public id!: string;
    public name!: string;
    public location!: string;
    public status!: 'active' | 'deleted';
}

Warehouse.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true, // Prevents registering duplicate warehouse storage names
        },
        location: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM('active', 'deleted'),
            allowNull: false,
            defaultValue: 'active', // All storage facilities initialize active by default
        },
    },
    {
        sequelize,
        modelName: 'Warehouse',
        tableName: 'warehouses', // Pluralized relational table footprint
    }
);
