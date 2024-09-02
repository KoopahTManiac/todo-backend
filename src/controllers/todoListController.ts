import { Request, Response } from 'express';
import ws from 'ws';

export const createTodoList = async (req: Request, res: Response): Promise<void> => {
    // Implement create todo list
};

export const getTodoLists = async (req: Request, res: Response): Promise<void> => {
    // Implement get todo lists
};

export const getTodoListById = async (req: Request, res: Response): Promise<void> => {
    // Implement get todo list by id
};

export const updateTodoList = async (req: Request, res: Response): Promise<void> => {
    // Implement update todo list
};

export const deleteTodoList = async (req: Request, res: Response): Promise<void> => {
    // Implement delete todo list
};

export const generateTodoListURL = async (req: Request, res: Response): Promise<void> => {
    // Implement generate todo list url
};

export const wsTodoList = async (ws: ws, req: Request): Promise<void> => {
    // Implement websocket for todo list
};