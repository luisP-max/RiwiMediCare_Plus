import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db.js';
import { Clinic } from './clinic.model.js';
import { Medicine } from './medicine.model.js';
import { Warehouse } from './warehouse.model.js';

/**
 * Request Model representing the 'requests' table in PostgreSQL.
 * Manages the complete lifecycle logs of medical supply replenishment orders.
 */
export class RequestSupply extends Model {
    public id!: string;
    public clinicId!: string;
    public medicineId!: string;
    public warehouseId!: string;
    public requestedQuantity!: number;
    public status!: 'Pending' | 'Approved' | 'Rejected';
}

RequestSupply.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        clinicId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: Clinic,
                key: 'id',
            },
        },
        medicineId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: Medicine,
                key: 'id',
            },
        },
        warehouseId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: Warehouse,
                key: 'id',
            },
        },
        requestedQuantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1, // Quantities must be greater than zero
            },
        },
        status: {
            type: DataTypes.ENUM('Pending', 'Approved', 'Rejected'),
            allowNull: false,
            defaultValue: 'Pending', // Every replenishment order begins as Pending
        },
    },
    {
        sequelize,
        modelName: 'RequestSupply',
        tableName: 'requests',
    }
);

// STATEMENT ON PARTNERSHIPS (SEQUELIZE'S FORMAL RELATIONSHIPS)
Clinic.hasMany(RequestSupply, { foreignKey: 'clinicId' });
RequestSupply.belongsTo(Clinic, { foreignKey: 'clinicId', as: 'clinic' });

Medicine.hasMany(RequestSupply, { foreignKey: 'medicineId' });
RequestSupply.belongsTo(Medicine, { foreignKey: 'medicineId', as: 'medicine' });

Warehouse.hasMany(RequestSupply, { foreignKey: 'warehouseId' });
RequestSupply.belongsTo(Warehouse, { foreignKey: 'warehouseId', as: 'warehouse' });
