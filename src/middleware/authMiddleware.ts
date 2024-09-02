import { Request, Response, NextFunction } from 'express';
import AuthKeyModel from '../models/AuthKey';
import UserModel, { SafeUser, toSafeUser, User } from '../models/User';

/**
 * Middleware function to authenticate a user based on an AuthKey provided in the headers.
 * 
 * @param req The request object.
 * @param res The response object.
 * @param next The next middleware function in the stack.
 */
export async function authenticateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    const authKey = req.headers['authorization'];

    if (!authKey) {
        next();
        return;
    }

    const [userId, key] = parseAuthKey(authKey);

    if (!userId || !key) {
        res.status(401).json({ status: 'error', message: 'Invalid authorization key format' });
        return;
    }

    try {
        const validAuthKey = await AuthKeyModel.getAuthKey(key, userId);

        if (!validAuthKey) {
            res.status(401).json({ status: 'error', message: 'Invalid or expired authorization key' });
            return;
        }

        const user = toSafeUser(await UserModel.getUserById(userId));
        if(!user) {
            res.status(401).json({ status: 'error', message: 'Invalid or expired authorization key' });
            return;
        }
        user.authKey = key;
        req.user =  user;

        next();
    } catch (error) {
        console.error('Error during authentication:', error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
}

/**
 * Parses the Authorization header to extract the userId and key.
 * The format assumed here is "Bearer userId:key".
 * 
 * @param authKey The authorization key string from the headers.
 * @returns A tuple containing the userId and key.
 */
function parseAuthKey(authKey: string): [number, string] | [null, null] {
    if (!authKey.startsWith('Bearer ')) {
        return [null, null];
    }

    const token = authKey.slice(7); // Remove "Bearer " prefix
    const parts = token.split(':');

    if (parts.length !== 2) {
        return [null, null];
    }

    const userId = parseInt(parts[0], 10);
    const key = parts[1];

    return isNaN(userId) ? [null, null] : [userId, key];
}