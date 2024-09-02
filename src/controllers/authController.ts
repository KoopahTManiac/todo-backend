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

    const response = await userService.createUser(req.body.username, req.body.password);
    if(response.status !== 'success') {
        res.status(400).json(response);
        return;
    }
    res.json(response);
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
    const response = await userService.loginUser(req.body.username, req.body.password);
    if(response.status !== 'success') {
        res.status(400).json(response);
        return;
    }
    if(!response.safeUser) {
        res.status(400).json(response);
        return;
    }
    response.safeUser.authKey = response.authKey?.key;
    res.json(response);
    
};

export const getUserProfile = async (req: Request, res: Response): Promise<void> => {
    const response = await userService.getUserById(req.body.id);
    if(response.status !== 'success') {
        res.status(400).json(response);
        return;
    }
    res.json(response);
};

export const logoutUser = async (req: Request, res: Response): Promise<void> => {
    if(!req.user) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }

    const authKey = req.user.authKey;
    if(!authKey) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }

    const response = await userService.logoutUser(authKey);
    if(response.status !== 'success') {
        res.status(200).json(response);
        return;
    }
    res.json(response);
};

