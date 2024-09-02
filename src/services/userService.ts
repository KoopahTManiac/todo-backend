import { toSafeUser ,SafeUser, User, default as UserModel } from '../models/User';
import { AuthKey, default as AuthKeyModel } from '../models/AuthKey';
import * as bcrypt from 'bcrypt';
import { PostgresError } from 'pg-error-enum';

/**
 * A status object indicating the success or failure of an operation.
 * 
 * @param status The status of the operation. Can be 'success' or 'error'.
 * @param message A message describing the status of the operation.
 * @param error An error object if there was a was an error.
 * @param safeUser A safe user object if the operation was successful. password is stripped from the user object.
 * @param authKey An auth key object if the operation was successful.
 */
export interface UserStatus {
    status: UserStatusCode;
    message: string;
    error?: string;
    safeUser?: SafeUser;
    authKey?: AuthKey;
}

/**
 * The status codes for user operations.
 */
export enum UserStatusCode {
    SUCCESS = 'success',
    ERROR = 'error',
}

class UserService {

    /**
     * Creates a new user with the given username and password. the password is hashed using bcrypt.
     * 
     * @param username The username of the new user.
     * @param password The password of the new user.
     * @returns A status object indicating the success or failure of the operation. with a message and a safeUser if successful.
     */
    async createUser(username: string, password: string): Promise<UserStatus> {
        try {

            if(username.length < 6) {
                return { status: UserStatusCode.ERROR, message: 'Username must be at least 6 characters long' };
            }

            if(password.length < 6) {
                return { status: UserStatusCode.ERROR, message: 'Password must be at least 6 characters long' };
            }

            // Hash password using bcrypt
            const hashedPassword = await bcrypt.hash(password, 10);

            const user = await UserModel.createUser(username, hashedPassword);
            if (!user) {
                return { status: UserStatusCode.ERROR, message: 'Username already exists or error creating user' };
            }

            const authKey = await AuthKeyModel.createAuthKey(user.id);
            if (!authKey) {
                return { status: UserStatusCode.ERROR, message: 'Error creating auth key' };
            }

            return { status: UserStatusCode.SUCCESS, message: 'User created', safeUser: toSafeUser(user), authKey };
        } catch (error: any) {
            if(error.code && error.code === PostgresError.UNIQUE_VIOLATION) {
                return { status: UserStatusCode.ERROR, message: 'Username already exists or error creating user' };
            }
            console.error('Error creating user:', error);
            return { status: UserStatusCode.ERROR, message: 'Internal server error', error };
        }
    }

    /**
     * Gets a user by their ID.
     * 
     * @param id The ID of the user to get.
     * @returns A status object indicating the success or failure of the operation. with a message and a safeUser if successful.
     */
    async getUserById(id: number): Promise<UserStatus> {
        try {
            const user = await UserModel.getUserById(id);
            if (!user) {
                return { status: UserStatusCode.ERROR, message: 'User not found' };
            }

            return { status: UserStatusCode.SUCCESS, message: 'User found', safeUser: toSafeUser(user) };
        } catch (error: any) {
            return { status: UserStatusCode.ERROR, message: 'Internal server error', error };
        }
    }

    /**
     * Gets a user by their username.
     * 
     * @param username The username of the user to get.
     * @returns A status object indicating the success or failure of the operation. with a message and a safeUser if successful.
     */
    async getUserByUsername(username: string): Promise<UserStatus> {
        try {
            const user = await UserModel.getUserByUsername(username);
            if (!user) {
                return { status: UserStatusCode.ERROR, message: 'User not found' };
            }

            return { status: UserStatusCode.SUCCESS, message: 'User found', safeUser: toSafeUser(user) };
        } catch (error: any) {
            return { status: UserStatusCode.ERROR, message: 'Internal server error', error };
        }
    }

    /**
     * Updates a user's username and password.
     * 
     * @param id The ID of the user to update.
     * @param username The new username for the user.
     * @param password The new password for the user.
     * @returns A status object indicating the success or failure of the operation. with a message and a safeUser if successful.
     */
    async updateUser(id: number, username: string, password: string): Promise<UserStatus> {
        try {
            // Hash the new password before updating
            const hashedPassword = await bcrypt.hash(password, 10);

            const user = await UserModel.updateUser(id, username, hashedPassword);
            if (!user) {
                return { status: UserStatusCode.ERROR, message: 'User not found or error updating user' };
            }

            return { status: UserStatusCode.SUCCESS, message: 'User updated', safeUser: toSafeUser(user) };
        } catch (error: any) {
            return { status: UserStatusCode.ERROR, message: 'Internal server error', error };
        }
    }

    /**
     * Deletes a user by their ID.
     * 
     * @param id The ID of the user to delete.
     * @returns A status object indicating the success or failure of the operation. with a message if successful.
     */
    async deleteUser(id: number): Promise<UserStatus> {
        try {
            const result = await UserModel.deleteUser(id);
            if (!result) {
                return { status: UserStatusCode.ERROR, message: 'User not found or error deleting user' };
            }

            return { status: UserStatusCode.SUCCESS, message: 'User deleted' };
        } catch (error: any) {
            return { status: UserStatusCode.ERROR, message: 'Internal server error', error };
        }
    }

    /**
     * Logs in a user by their username and password.
     * 
     * @param username The username of the user to log in.
     * @param password The password of the user to log in.
     * @returns A status object indicating the success or failure of the operation. with a message and a safeUser and authKey if successful.
     */
    async loginUser(username: string, password: string): Promise<UserStatus> {
        try {
            if (!username || !password) {
                return { status: UserStatusCode.ERROR, message: 'Username and password are required' };
            }
    
            const user = await UserModel.getUserByUsername(username);
            if (!user) {
                return { status: UserStatusCode.ERROR, message: 'User not found' };
            }
    
            const passwordMatch = await bcrypt.compare(password, user.password as string);
            if (!passwordMatch) {
                return { status: UserStatusCode.ERROR, message: 'Incorrect password' };
            }
    
            const authKey = await AuthKeyModel.createAuthKey(user.id);
            if (!authKey) {
                return { status: UserStatusCode.ERROR, message: 'Error creating auth key' };
            }
    
            return { 
                status: UserStatusCode.SUCCESS,
                message: 'User logged in',
                safeUser: toSafeUser(user),
                authKey
            };
        } catch (error: any) {
            return { status: UserStatusCode.ERROR, message: 'Internal server error', error };
        }
    }

    /**
     * Logs out a user by their current auth key. allowing for multiple concurrent logins.
     * 
     * @param key The auth key of the user to log out.
     * @param userId The ID of the user to log out.
     * @returns A status object indicating the success or failure of the operation. with a message if successful.
     */
    async logoutUser(key: string): Promise<UserStatus> {
        try {
            const result = await AuthKeyModel.deleteAuthKey(key);
            if (!result) {
                return { status: UserStatusCode.ERROR, message: 'Error logging out user' };
            }

            return { status: UserStatusCode.SUCCESS, message: 'User logged out' };
        } catch (error: any) {
            return { status: UserStatusCode.ERROR, message: 'Internal server error', error };
        }
    }

    /**
     * Clears all auth keys for a user. logout all sessions.
     * 
     * @param userId The ID of the user to clear auth keys for.
     * @returns A status object indicating the success or failure of the operation. with a message if successful.
     */
    async clearAuthKeys(userId: number): Promise<UserStatus> {
        try {
            const result = await AuthKeyModel.deleteAuthKeyByUserId(userId);
            if (!result) {
                return { status: UserStatusCode.ERROR, message: 'Error clearing auth keys' };
            }

            return { status: UserStatusCode.SUCCESS, message: 'Auth keys cleared' };
        } catch (error: any) {
            return { status: UserStatusCode.ERROR, message: 'Internal server error', error };
        }
    }
}

export default new UserService();