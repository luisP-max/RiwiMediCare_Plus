import { Sequelize } from 'sequelize';
import 'dotenv/config';

// Instanciamos el constructor del ORM Sequelize con las credenciales del sistema
export const sequelize = new Sequelize(
    process.env.DB_NAME || 'riwicare_db',
    process.env.DB_USER || 'postgres',
    process.env.DB_PASSWORD || 'postgres',
    {
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT) || 5432,
        dialect: 'postgres',
        logging: false, // Desactivamos los logs ruidosos en la consola para mantenerla limpia
        define: {
            timestamps: true, // Habilita de forma automatica las columnas createdAt y updatedAt
            underscored: true // Transforma camelCase a snake_case en la base de datos (ej: clinic_id)
        }
    }
);

// Funcion asincrona para comprobar el estado de la red con el contenedor de Docker
export const ConnectDB = async (): Promise<void> => {
    try {
        await sequelize.authenticate();
        console.log('[Database] Conexion con el ORM Sequelize establecida con exito.');
        
        // El comando sync() se encargara de crear fisicamente todas las tablas del modelo mas adelante
        await sequelize.sync({ alter: true });
        console.log('[Database] Inicializacion y sincronizacion del esquema relacional completada.');
    } catch (error) {
        console.error('[Database Error] Fallo critico de enlace en la infraestructura:', error);
        process.exit(1);
    }
};
