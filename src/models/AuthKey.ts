import { QueryResult } from 'pg';
import { pool } from '../config/database';
import { randomBytes } from 'crypto';
import { inOneYear } from '../helper/fn';

export interface AuthKey {
    id: number;
    userId: number;
    key: string;
    expires_at: Date;
}

class AuthKeyModel {

    /**
     * Creates an auth key for a user.
     *
     * @param userId - The ID of the user for whom the auth key is being created.
     * @returns The created AuthKey object or null if an error occurs.
     */
    async createAuthKey(userId: number): Promise<AuthKey | null> {
        const key = randomBytes(32).toString('hex');
        const expired_at = inOneYear(new Date());
        try {
            const result: QueryResult<AuthKey> = await pool.query(
                'INSERT INTO auth_keys (user_id, key, expired_at) VALUES ($1, $2, $3) RETURNING *',
                [ userId, key, expired_at ]
            );
            return result.rows[0] ?? null;
        } catch (error) {
            console.error('Error creating auth key:', error);
            return null;
        }
    }

    /**
     * Retrieves an auth key for a user.
     * 
     * @param key - The auth key string.
     * @param userId - The ID of the user associated with the auth key.
     * @returns The AuthKey object or null if not found or if an error occurs.
     */
    async getAuthKey(key: string, userId: number): Promise<AuthKey | null> {
        try {
            const result: QueryResult<AuthKey> = await pool.query(
                'SELECT * FROM auth_keys WHERE user_id = $1 AND key = $2',
                [ userId, key ]
            );
            return result.rows[0] || null;
        } catch (error) {
            console.error('Error fetching auth key:', error);
            return null;
        }
    }

    /**
     * Deletes a auth key.
     * 
     * @param key - The auth key string.
     * @returns True if the auth key was deleted, false otherwise.
     */
    async deleteAuthKey(key: string): Promise<boolean> {
        try {
            const result: QueryResult = await pool.query('DELETE FROM auth_keys WHERE key = $1', [key]);
            return result.rowCount? result.rowCount > 0 : false;
        } catch (error) {
            console.error('Error deleting auth key:', error);
            return false;
        }
    }

    /**
     * Deletes all auth keys for a user.
     * 
     * @param userId - The ID of the user whose auth keys are being deleted.
     * @returns True if the auth keys were deleted, false otherwise.
     */
    async deleteAuthKeyByUserId(userId: number): Promise<boolean> {
        try {
            const result: QueryResult = await pool.query('DELETE FROM auth_keys WHERE user_id = $1', [userId]);
            return result.rowCount? result.rowCount > 0 : false;
        } catch (error) {
            console.error('Error deleting auth keys by user ID:', error);
            return false;
        }
    }
}

export default new AuthKeyModel();
