import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db.js';

/**
 * User Model representing the 'users' table in PostgreSQL.
 * Manages administrative and operational credentials for the application.
 */
export class User extends Model {
    public id!: string;
    public name!: string;
    public email!: string;
    public password!: string;
    public role!: 'Administrator' | 'Request Manager';
}

User.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING(150),
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true, // Core integrity validation to enforce valid email structures
            },
        },
        password: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        role: {
            type: DataTypes.ENUM('Administrator', 'Request Manager'),
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: 'User',
        tableName: 'users', // Pluralized database table name in lowercase English
    }
);
