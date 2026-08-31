import express from 'express';
import 'dotenv/config';
import { ConnectDB } from './config/db.js';
import routerAuth from './routes/auth.router.js';

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Middlewares globales obligatorios para procesar payloads JSON
app.use(express.json());

// Montaje de enrutadores oficiales del sistema
app.use('/api/auth', routerAuth);

// Inicializacion asincrona de la infraestructura de RiwiMediCare
const startServer = async () => {
    try {
        // Conectar y sincronizar las tablas de Sequelize con PostgreSQL
        await ConnectDB();
        
        app.listen(PORT, () => {
            console.log(`[Server] Servidor Express corriendo en el puerto ${PORT} con exito.`);
        });
    } catch (error) {
        console.error('[Server Error] Fallo critico al inicializar el servidor:', error);
        process.exit(1);
    }
};

startServer();

export default app;