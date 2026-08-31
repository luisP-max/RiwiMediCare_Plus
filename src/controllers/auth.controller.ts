import { type Request, type Response } from 'express';
import { User } from '../models/user.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'llave_secreta_super_segura_de_riwicare';

// 1. REGISTRO DE USUARIOS
export const registrarUsuario = async (req: Request, res: Response) => {
    try {
        const { nombre, email, password, rol } = req.body;

        if (!nombre || !email || !password || !rol) {
            return res.status(400).json({ message: 'Error: Todos los campos son obligatorios.' });
        }

        if (rol !== 'Administrador' && rol !== 'Gestor de Solicitudes') {
            return res.status(400).json({ message: "Error: El rol debe ser 'Administrador' o 'Gestor de Solicitudes'." });
        }

        // Encriptamos la clave por seguridad utilizando bcrypt antes de impactar PostgreSQL
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Sequelize realiza el INSERT INTO automatico en la tabla usuarios
        const nuevoUsuario = await User.create({
            nombre,
            email,
            password: passwordHash,
            rol
        });

        return res.status(201).json({
            message: 'Usuario registrado con exito en RiwiMediCare',
            usuario: {
                id: nuevoUsuario.id,
                nombre: nuevoUsuario.nombre,
                email: nuevoUsuario.email,
                rol: nuevoUsuario.rol
            }
        });
    } catch (error) {
        console.error('[Auth Error] Error en el registro de usuario:', error);
        return res.status(500).json({ message: 'Error interno al registrar el usuario', error });
    }
};

// 2. INICIO DE SESIÓN (LOGIN)
export const iniciarSesion = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Error: Correo y contraseña requeridos.' });
        }

        // Busqueda parametrizada nativa de Sequelize mediantefindOne
        const usuario = await Usuario.findOne({ where: { email } });
        if (!usuario) {
            return res.status(401).json({ message: 'Credenciales invalidas (Correo incorrecto).' });
        }

        // Verificamos si la clave coincide contra el Hash guardado en Docker
        const passwordValido = await bcrypt.compare(password, usuario.password);
        if (!passwordValido) {
            return res.status(401).json({ message: 'Credenciales invalidas (Contraseña incorrecta).' });
        }

        // Firmamos el token digital de acceso con una duracion de 2 horas
        const token = jwt.sign(
            { id: usuario.id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol },
            JWT_SECRET,
            { expiresIn: '2h' }
        );

        return res.json({
            message: 'Autenticacion exitosa. Bienvenido a RiwiMediCare Plus',
            token,
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre,
                email: usuario.email,
                rol: usuario.rol
            }
        });
    } catch (error) {
        console.error('[Auth Error] Error en el inicio de sesion:', error);
        return res.status(500).json({ message: 'Error interno en el servidor durante el login', error });
    }
};
