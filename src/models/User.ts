import { pool } from '../config/database';

interface User {
    id: number;
    username: string;
    password: string;
}

class UserModel {
    createUser(username: string, password: string): User {
        // TODO: Implement create user
    }

    getUserById(id: number): User {
        // TODO: Implement get user by id
    }

    getUserByUsername(username: string): User {
        // TODO: Implement get user by username
    }

    updateUser(id: number, username: string, password: string): User {
        // TODO: Implement update user
    }

    deleteUser(id: number): void {
        // TODO: Implement delete user
    }
}

export default new UserModel();