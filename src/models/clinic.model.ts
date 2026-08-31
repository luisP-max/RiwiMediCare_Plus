import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db.js';

export class Clinica extends Model {
    public id!: string;
    public nit!: string;
    public nombre!: string;
    public direccion!: string;
    public responsable_nombre!: string;
    public estado!: 'activo' | 'eliminado';
}

Clinica.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        nit: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true, // Bloquea de forma nativa en PostgreSQL los NITs duplicados
        },
        nombre: {
            type: DataTypes.STRING(150),
            allowNull: false,
        },
        direccion: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        responsable_nombre: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        estado: {
            type: DataTypes.ENUM('activo', 'eliminado'),
            allowNull: false,
            defaultValue: 'activo', // Toda clinica nace activa en el sistema
        },
    },
    {
        sequelize,
        modelName: 'Clinica',
        tableName: 'clinicas',
    }
);
