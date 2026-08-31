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

        // Basic payload data integrity validation
        if (!name || !email || !password || !role) {
            return res.status(400).json({ message: 'Error: All payload fields (name, email, password, role) are strictly mandatory.' });
        }

        // Validate corporate role compliance criteria
        if (role !== 'Administrator' && role !== 'Request Manager') {
            return res.status(400).json({ message: "Error: The user role must be exactly 'Administrator' or 'Request Manager'." });
        }

        // Secure password hashing using bcrypt before relational database ingestion
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Execute ORM query abstraction to insert a new row physically into PostgreSQL
        const newUser = await User.create({
            name,
            email,
            password: passwordHash,
            role
        });

        return res.status(201).json({
            message: 'User administrative account successfully created within the system.',
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role
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

        // Query the database using Sequelize abstraction to identify the user email row
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: 'Invalid authentication credentials provided (Email mismatch).' });
        }

        // Compare incoming plain text password against the hashed footprint stored in Docker
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid authentication credentials provided (Password mismatch).' });
        }

        // Sign the cryptographic access token payload with a strict 2-hour lifecycle expiration
        const accessToken = jwt.sign(
            { id: user.id, name: user.name, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: '2h' }
        );

        return res.json({
            message: 'Authentication successful. Welcome to RiwiMediCare Plus infrastructure.',
            token: accessToken,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('[Auth Controller Error] Internal server login exception triggered:', error);
        return res.status(500).json({ message: 'Internal server error triggered during the authentication protocol sequence.', error });
    }
};
