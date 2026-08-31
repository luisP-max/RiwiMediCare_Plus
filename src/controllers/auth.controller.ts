import { type Request, type Response } from 'express';
import { User } from '../models/user.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'high_security_corporate_jwt_secret_token_2026';

/**
 * Handles the registration logic for new users.
 * Public endpoint without access token validation as per page 2 criteria.
 */
export const registerUser = async (req: Request, res: Response) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password || !role) {
            return res.status(400).json({ message: 'Error: All payload fields (name, email, password, role) are strictly mandatory.' });
        }

        if (role !== 'Administrator' && role !== 'Request Manager') {
            return res.status(400).json({ message: "Error: The user role must be exactly 'Administrator' or 'Request Manager'." });
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            name,
            email,
            password: passwordHash,
            role
        });

        // Use get({ plain: true }) to extract the raw database values and avoid empty object serialization issues
        const rawUser = newUser.get({ plain: true });

        return res.status(201).json({
            message: 'User administrative account successfully created within the system.',
            user: {
                id: rawUser.id,
                name: rawUser.name,
                email: rawUser.email,
                role: rawUser.role
            }
        });
    } catch (error) {
        console.error('[Auth Controller Error] Failed to persist user registration:', error);
        return res.status(500).json({ message: 'Internal server error encountered while creating the user account.', error });
    }
};

/**
 * Validates credentials and generates an access JSON Web Token (JWT).
 */
export const logInUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Error: Credentials payload requires both email and password keys.' });
        }

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: 'Invalid authentication credentials provided (Email mismatch).' });
        }

        // Use get({ plain: true }) to extract the clean object prior to processing the bcrypt comparison algorithm
        const rawUser = user.get({ plain: true });

        const isPasswordValid = await bcrypt.compare(password, rawUser.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid authentication credentials provided (Password mismatch).' });
        }

        const accessToken = jwt.sign(
            { id: rawUser.id, name: rawUser.name, email: rawUser.email, role: rawUser.role },
            JWT_SECRET,
            { expiresIn: '2h' }
        );

        return res.json({
            message: 'Authentication successful. Welcome to RiwiMediCare Plus infrastructure.',
            token: accessToken,
            user: {
                id: rawUser.id,
                name: rawUser.name,
                email: rawUser.email,
                role: rawUser.role
            }
        });
    } catch (error) {
        console.error('[Auth Controller Error] Internal server login exception triggered:', error);
        return res.status(500).json({ message: 'Internal server error triggered during the authentication protocol sequence.', error });
    }
};
