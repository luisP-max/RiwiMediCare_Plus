import { type Request, type Response, type NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'high_security_corporate_jwt_secret_token_2026';

interface JwtPayload {
    id: string;
    name: string;
    email: string;
    role: 'Administrator' | 'Request Manager';
}

/**
 * Authentication middleware that intercepts and validates inbound corporate JWT access tokens.
 */
export const checkAuth = (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ 
                message: 'Access denied: A valid Bearer authorization token header is strictly required.' 
            });
        }

        const parts = authHeader.split(' ');
        const accessToken = parts[1]; // Correct array extraction for token string placement

        if (!accessToken) {
            return res.status(401).json({ message: 'Access denied: Invalid authentication token structure.' });
        }

        // Verify the cryptographic footprint signatures against our application secret key
        const decoded = jwt.verify(accessToken, JWT_SECRET) as JwtPayload;

        // Attach the validated identity into the req object body space for role checking down the stream
        req.body.authenticatedUser = decoded;
        
        return next();
    } catch (error) {
        console.error('[Auth Middleware Exception] Token validation routine rejected:', error);
        return res.status(401).json({ 
            message: 'Access denied: The provided access token has expired or contains an invalid signature.'
        });
    }
};

/**
 * Authorization middleware role gatekeeper.
 * Blocks non-administrative user permissions from reaching destructive CRUD endpoints.
 */
export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
    const user = req.body.authenticatedUser;

    if (!user || user.role !== 'Administrator') {
        return res.status(403).json({ 
            message: 'Forbidden resource: This endpoint execution requires high-level Administrator privileges.' 
        });
    }

    return next();
};
