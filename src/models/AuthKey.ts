import { QueryResult } from 'pg';
import { pool } from '../config/database';

export interface AuthKey {
    id: number;
    userId: number;
    key: string;
}

class AuthKeyModel {
    async createAuthKey(userId: number, key: string): Promise<AuthKey | null> {
        try {
            const result: QueryResult<AuthKey> = await pool.query(
                'INSERT INTO auth_keys (user_id, key) VALUES ($1, $2) RETURNING *',
                [userId, key]
            );
            return result.rows[0] || null;
        } catch (error) {
            console.error('Error creating auth key:', error);
            return null;
        }
    }

    async getAuthKey(key: string, userId: number): Promise<AuthKey | null> {
        try {
            const result: QueryResult<AuthKey> = await pool.query(
                'SELECT * FROM auth_keys WHERE user_id = $1 AND key = $2',
                [userId, key]
            );
            return result.rows[0] || null;
        } catch (error) {
            console.error('Error fetching auth key:', error);
            return null;
        }
    }

    async deleteAuthKey(key: string): Promise<boolean> {
        try {
            const result: QueryResult = await pool.query('DELETE FROM auth_keys WHERE key = $1', [key]);
            return result.rowCount? result.rowCount > 0 : false;
        } catch (error) {
            console.error('Error deleting auth key:', error);
            return false;
        }
    }

    async deleteAuthKeyByUserId(userId: number): Promise<boolean> {
        try {
            const result: QueryResult = await pool.query('DELETE FROM auth_keys WHERE user_id = $1', [userId]);
            return result.rowCount? result.rowCount > 0 : false;
        } catch (error) {
            console.error('Error deleting auth keys by user ID:', error);
            return false;
        }
    }

    async setupAuthKeysTable(): Promise<void> {
        try {
            await pool.query('CREATE TABLE IF NOT EXISTS auth_keys (id SERIAL PRIMARY KEY, user_id INTEGER NOT NULL, key TEXT NOT NULL, UNIQUE (user_id, key))');
        } catch (error) {
            console.error('Error setting up auth keys table:', error);
        }
    }
}

export default new AuthKeyModel();
