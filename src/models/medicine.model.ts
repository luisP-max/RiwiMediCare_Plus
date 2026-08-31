import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db.js';

/**
 * Medicine Model representing the 'medicines' table in PostgreSQL.
 * Manages the corporate stock inventory metadata definitions for healthcare distribution.
 */
export class Medicine extends Model {
    public id!: string;
    public name!: string;
    public description!: string;
    public status!: 'active' | 'deleted';
}

Medicine.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING(150),
            allowNull: false,
            unique: true, // Prevents duplicate pharmaceutical catalog name entries
        },
        description: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM('active', 'deleted'),
            allowNull: false,
            defaultValue: 'active', // All pharmaceutical rows initialize active by default
        },
    },
    {
        sequelize,
        modelName: 'Medicine',
        tableName: 'medicines', // Pluralized database catalog table name mapping
    }
);
