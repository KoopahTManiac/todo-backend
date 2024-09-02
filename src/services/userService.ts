import { User, default as UserModel } from '../models/User';
import { AuthKey, default as AuthKeyModel } from '../models/AuthKey';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';

interface Status {
    status: string;
    message: string;
    user?: User;
    authKey?: AuthKey;
}

class UserService {

    async createUser(username: string, password: string): Promise<Status> {
        try {
            // Hash password using bcrypt
            const hashedPassword = await bcrypt.hash(password, 10);

            const user = await UserModel.createUser(username, hashedPassword);
            if (!user) {
                return { status: 'error', message: 'Username already exists or password is too short' };
            }

            return { status: 'success', message: 'User created successfully', user };
        } catch (error) {
            console.error('Error creating user:', error);
            return { status: 'error', message: 'Internal server error' };
        }
    }

    async getUserById(id: number): Promise<Status> {
        const result = UserModel.getUserById(id);
        if(!result) {
            return { status: 'error', message: 'User not found' };
        }

        return { status: 'success', message: 'User found successfully', user: result };
    }

    async getUserByUsername(username: string): Promise<Status> {
        const result = UserModel.getUserByUsername(username);
        if(!result) {
            return { status: 'error', message: 'User not found' };
        }

        return { status: 'success', message: 'User found successfully', user: result };
    }

    async updateUser(id: number, username: string, password: string): Promise<Status> {
        const result = UserModel.updateUser(id, username, password);
        if(!result) {
            return { status: 'error', message: 'User not found or error updating user' };
        }

        return { status: 'success', message: 'User updated successfully', user: result };
    }

    async deleteUser(id: number): Promise<Status> {
        const result = UserModel.deleteUser(id);
        if(!result) {
            return { status: 'error', message: 'User not found or error deleting user' };
        }

        return { status: 'success', message: 'User deleted successfully' };
    }

    async loginUser(username: string, password: string): Promise<Status> {

        if(!username || !password) {
            return { status: 'error', message: 'Username and password are required' };
        }

        const user = UserModel.getUserByUsername(username);
        if(!user) {
            return { status: 'error', message: 'User not found' };
        }

        const result = UserModel.checkPassword(username, password);

        if(!result) {
            return { status: 'error', message: 'Incorrect password' };
        }

        const authKey: AuthKey | null = await AuthKeyModel.createAuthKey(user.id, randomBytes(32).toString('hex'));
        if(!authKey) {
            return { status: 'error', message: 'Error creating auth key' };
        }

        return { status: 'success', message: 'User logged in successfully', user, authKey };
    }

    async logoutUser(key: string): Promise<Status> {
        const result = AuthKeyModel.deleteAuthKey(key);
        if(!result) {
            return { status: 'error', message: 'Error logging out user' };
        }

        return { status: 'success', message: 'User logged out successfully' };
    }

    async clearAuthKeys(userId: number): Promise<Status> {
        const result = AuthKeyModel.deleteAuthKeyByUserId(userId);
        if(!result) {
            return { status: 'error', message: 'Error clearing auth keys' };
        }

        return { status: 'success', message: 'Auth keys cleared successfully' };
    }
}

export default new UserService();