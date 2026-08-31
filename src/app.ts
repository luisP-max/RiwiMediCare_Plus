import express from 'express';
import 'dotenv/config';
import { ConnectDB } from './config/db.js';
import routerAuth from './routes/auth.router.js';
import routerClinic from './routes/clinic.router.js';
import routerWarehouse from './routes/warehouse.router.js';
import routerMedicine from './routes/medicine.router.js';
import routerRequest from './routes/request.router.js';
import routerSeed from './routes/seed.router.js';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger.js';

const app = express();
const PORT = Number(process.env.PORT) || 3000;

/**
 * Global HTTP Middlewares.
 * Configures the Express engine to natively process incoming JSON payloads.
 */
app.use(express.json());


/**
 * System Route Registrations.
 * Mounts operational controllers onto standard REST endpoint path structures.
 */
app.use('/api/auth', routerAuth);
app.use('/api/clinics', routerClinic);
app.use('/api/warehouses', routerWarehouse);
app.use('/api/medicines', routerMedicine);
app.use('/api/requests', routerRequest);
app.use('/api/seeds', routerSeed);
// Serves the full interactive Swagger visualization layer interface over /api-docs route path
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * Core asynchronous server bootstrap sequence.
 * Establishes database handshakes before opening network interface sockets.
 */
const startServer = async () => {
    try {
        // Initialize and synchronize all Sequelize data models with the database container
        await ConnectDB();
        
        app.listen(PORT, () => {
            console.log(`[Server] Express REST API server running on network interface port ${PORT} successfully.`);
        });
    } catch (error) {
        console.error('[Server Error] Critical exception encountered during the core bootstrap protocol:', error);
        process.exit(1);
    }
};

startServer();

export default app;
