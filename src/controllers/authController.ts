import { Request, Response } from 'express';
import userService from '../services/userService';

export const registerUser = async (req: Request, res: Response): Promise<void> => {
    if(!req.body.username || !req.body.password) {
        res.status(400).json({ message: 'Username and password are required' });
        return;
    }

    if(req.body.username.length < 6) {
        res.status(400).json({ message: 'Username must be at least 6 characters long' });
        return;
    }

    if(req.body.password.length < 6) {
        res.status(400).json({ message: 'Password must be at least 6 characters long' });
        return;
    }

    const user = userService.createUser(req.body.username, req.body.password);
    res.json({ message: 'User created successfully', user });
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
    const user = userService.loginUser(req.body.username, req.body.password);
    res.json(user);
};

export const getUserProfile = async (req: Request, res: Response): Promise<void> => {
    const user = userService.getUserById(req.body.id);
    res.json(user);
};

export const logoutUser = async (req: Request, res: Response): Promise<void> => {
    userService.logoutUser(req.body.id);
    res.json({ message: 'User logged out successfully' });
};