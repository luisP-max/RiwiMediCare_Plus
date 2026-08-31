import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db.js';
import { Warehouse } from './warehouse.model.js';
import { Medicine } from './medicine.model.js';

export class WarehouseStock extends Model {
    public id!: string;
    public warehouseId!: string;
    public medicineId!: string;
    public availableQuantity!: number;
}

WarehouseStock.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        warehouseId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: { model: Warehouse, key: 'id' },
        },
        medicineId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: { model: Medicine, key: 'id' },
        },
        availableQuantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1000, // Every seed or new item starts with a standard stock for testing
        },
    },
    {
        sequelize,
        modelName: 'WarehouseStock',
        tableName: 'warehouse_stocks',
    }
);

Warehouse.hasMany(WarehouseStock, { foreignKey: 'warehouseId' });
WarehouseStock.belongsTo(Warehouse, { foreignKey: 'warehouseId' });

Medicine.hasMany(WarehouseStock, { foreignKey: 'medicineId' });
WarehouseStock.belongsTo(Medicine, { foreignKey: 'medicineId' });
