import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db.js';

export class Usuario extends Model {
    public id!: string;
    public nombre!: string;
    public email!: string;
    public password!: string;
    public rol!: 'Administrador' | 'Gestor de Solicitudes';
}

Usuario.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        nombre: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING(150),
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            },
        },
        password: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        rol: {
            type: DataTypes.ENUM('Administrador', 'Gestor de Solicitudes'),
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: 'Usuario',
        tableName: 'usuarios',
    }
);
