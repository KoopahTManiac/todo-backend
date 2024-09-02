import { pool } from '../config/database';
import * as bcrypt from 'bcrypt';

export interface User {
    id: number;
    username: string;
    password: string | null;
    authKey?: string;
}

export interface SafeUser extends User {
    password: null;
}

export const toSafeUser = (user: User | null | undefined): SafeUser | undefined => {
    if (!user) {
        return undefined;
    }

    return {
        ...user,
        password: null
    };
}

class UserModel {
    async createUser(username: string, password: string): Promise<User | null> {
        const result = await pool.query(
            'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *',
            [username, password]
        );

        return result.rows[0] || null;
    }

    async getUserById(id: number): Promise<User | null> {
        const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);

        return result.rows[0] || null;
    }

    async getUserByUsername(username: string): Promise<User | null> {
        const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

        return result.rows[0] || null;
    }

    async updateUser(id: number, username: string, password: string): Promise<User | null> {
        const result = await pool.query(
            'UPDATE users SET username = $1, password = $2 WHERE id = $3 RETURNING *',
            [username, password, id]
        );

        return result.rows[0] || null;
    }

    async deleteUser(id: number): Promise<boolean> {
        const result = await pool.query('DELETE FROM users WHERE id = $1', [id]);

        return result.rowCount === 1;
    }

    async checkPassword(username: string, password: string): Promise<boolean> {
        const result = await pool.query('SELECT * FROM users WHERE username = $1 AND password = $2', [username, password]);

        if (result.rows.length === 0) {
            throw new Error('User not found');
        }

        const validPassword = bcrypt.compare(password, result.rows[0].password);

        return validPassword;
    }
}

export default new UserModel();