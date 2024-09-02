import { pool } from '../config/database';

export interface User {
    id: number;
    username: string;
    password: string | null;
}

class UserModel {
    async createUser(username: string, password: string): Promise<User | null> {
        // TODO: Implement create user
    }

    async getUserById(id: number): Promise<User | null> {
        // TODO: Implement get user by id
    }

    async getUserByUsername(username: string): Promise<User | null> {
        // TODO: Implement get user by username
    }

    async updateUser(id: number, username: string, password: string): Promise<User | null> {
        // TODO: Implement update user
    }

    async deleteUser(id: number): Promise<boolean> {
        // TODO: Implement delete user
    }

    async checkPassword(username: string, password: string): Promise<boolean> {
        // TODO: Implement check password
    }
}

export default new UserModel();