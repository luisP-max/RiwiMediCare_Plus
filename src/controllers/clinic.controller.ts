import { type Request, type Response } from 'express';
import { Clinica } from '../models/clinic.model.js';

// 1. REGISTRAR UNA NUEVA CLÍNICA
export const crearClinica = async (req: Request, res: Response) => {
    try {
        const { nit, nombre, direccion, responsable_nombre } = req.body;

        if (!nit || !nombre || !direccion || !responsable_nombre) {
            return res.status(400).json({ message: 'Error: Todos los campos (nit, nombre, direccion, responsable_nombre) son obligatorios.' });
        }

        const existeClinica = await Clinica.findOne({ where: { nit } });
        if (existeClinica) {
            return res.status(400).json({ message: `Error: Ya existe una clinica registrada con el NIT ${nit}.` });
        }

        const nuevaClinica = await Clinica.create({ nit, nombre, direccion, responsable_nombre });
        return res.status(201).json({ message: 'Clinica registrada con exito en el sistema', clinica: nuevaClinica });
    } catch (error) {
        console.error('[Clinic Error] Error al crear la clinica:', error);
        return res.status(500).json({ message: 'Error interno al registrar la clinica', error });
    }
};

// 2. CONSULTAR TODAS LAS CLÍNICAS ACTIVAS
export const obtenerClinicas = async (req: Request, res: Response) => {
    try {
        const clinicas = await Clinica.findAll({ where: { estado: 'activo' } });
        return res.json(clinicas);
    } catch (error) {
        return res.status(500).json({ message: 'Error al consultar las clinicas', error });
    }
};

// 3. ACTUALIZAR DATOS DE UNA CLÍNICA
export const actualizarClinica = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { nombre, direccion, responsable_nombre } = req.body;

        // Validacion de seguridad para garantizar que el ID no sea undefined ante el ORM
        if (!id || typeof id !== 'string') {
            return res.status(400).json({ message: 'Error: El parametro ID de la clinica es requerido.' });
        }

        const clinica = await Clinica.findByPk(id);
        if (!clinica || clinica.estado === 'eliminado') {
            return res.status(404).json({ message: 'Error: Clinica no encontrada o inactiva en el sistema.' });
        }

        await clinica.update({ nombre, direccion, responsable_nombre });
        return res.json({ message: 'Datos de la clinica actualizados con exito', clinica });
    } catch (error) {
        return res.status(500).json({ message: 'Error al actualizar la clinica', error });
    }
};

// 4. ELIMINACIÓN LÓGICA
export const eliminarClinica = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        // Validacion de seguridad para garantizar que el ID no sea undefined ante el ORM
        if (!id || typeof id !== 'string') {
            return res.status(400).json({ message: 'Error: El parametro ID de la clinica es requerido.' });
        }

        const clinica = await Clinica.findByPk(id);
        if (!clinica || clinica.estado === 'eliminado') {
            return res.status(404).json({ message: 'Error: La clinica no existe o ya fue removida.' });
        }

        await clinica.update({ estado: 'eliminado' });
        return res.json({ message: 'Clinica eliminada de forma logica en el sistema de manera exitosa.' });
    } catch (error) {
        return res.status(500).json({ message: 'Error al eliminar la clinica', error });
    }
};
