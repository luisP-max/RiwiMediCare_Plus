import express from 'express';
import { registrarUsuario, iniciarSesion } from '../controllers/auth.controller.js';

const router = express.Router();

// Rutas publicas de acceso al sistema sin restricciones de token
router.post('/register', registrarUsuario);
router.post('/login', iniciarSesion);

export default router;