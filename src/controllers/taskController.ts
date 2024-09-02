import { Request, Response } from 'express';
import taskService from '../services/taskService';
import { todo } from 'node:test';
import todoService from '../services/todoService';

export const createTask = async (req: Request, res: Response): Promise<void> => {
    if(!req.user) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }

    if(!req.body.todo_list_id) {
        res.status(400).json({ message: 'Invalid ID' });
        return;
    }

    const listId = parseInt(req.body.todo_list_id as string);
    if(isNaN(listId)) {
        res.status(400).json({ message: 'Invalid ID' });
        return;
    }

    const re = await todoService.getTodoListById(listId);
    if(!re) {
        res.status(400).json({ message: 'Task not found' });
        return;
    }

    if(req.body.task_id) {
        const taskId = parseInt(req.body.task_id as string);
        if(isNaN(taskId)) {
            res.status(400).json({ message: 'Invalid task ID' });
            return;
        }
        const task = await taskService.getTaskById(listId, taskId);
        if(!task) {
            res.status(400).json({ message: 'Task not found' });
            return;
        }
        const response = await taskService.createTask(listId, req.body.title, req.body.description, taskId);
        if(response.status !== 'success') {
            res.status(400).json(response);
            return;
        }
        res.json(response);
    }
    else {
        const response = await taskService.createTask(listId, req.body.title, req.body.description);
        if(response.status !== 'success') {
            res.status(400).json(response);
            return;
        }
        res.json(response);
    }


};

export const getTasks = async (req: Request, res: Response): Promise<void> => {
    if(!req.user) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }

    if(!req.query.todo_list_id) {
        res.status(400).json({ message: 'Invalid ID' });
        return;
    }

    const id = parseInt(req.query.todo_list_id as string);
    if(isNaN(id)) {
        res.status(400).json({ message: 'Invalid ID' });
        return;
    }

    const response = await taskService.getTasks(id);
    if(response.status !== 'success') {
        res.status(400).json(response);
        return;
    }
    res.json(response);
};

export const getTaskById = async (req: Request, res: Response): Promise<void> => {
    if(!req.user) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }

    if(!req.params.id) {
        res.status(400).json({ message: 'Invalid task ID' });
        return;
    }

    const id = parseInt(req.query.todo_list_id as string);
    if(isNaN(id)) {
        res.status(400).json({ message: 'Invalid ID' });
        return;
    }

    const taskId = parseInt(req.params.todo_list_id as string);
    if(isNaN(taskId)) {
        res.status(400).json({ message: 'Invalid task ID' });
        return;
    }

    const response = await taskService.getTaskById(id, taskId);
    if(response.status !== 'success') {
        res.status(400).json(response);
        return;
    }
    res.json(response);
};

export const updateTask = async (req: Request, res: Response): Promise<void> => {
    if(!req.user) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }

    if(!req.params.id) {
        res.status(400).json({ message: 'Invalid task ID' });
        return;
    }

    const id = parseInt(req.body.todo_list_id as string);
    if(isNaN(id)) {
        res.status(400).json({ message: 'Invalid ID' });
        return;
    }

    const taskId = parseInt(req.params.id as string);
    if(isNaN(taskId)) {
        res.status(400).json({ message: 'Invalid task ID' });
        return;
    }

    const response = await taskService.updateTask(id, taskId, req.body.title, req.body.description, req.body.is_completed);
    if(response.status !== 'success') {
        res.status(400).json(response);
        return;
    }
    res.json(response);
};

export const deleteTask = async (req: Request, res: Response): Promise<void> => {
    if(!req.user) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }

    if(!req.params.id) {
        res.status(400).json({ message: 'Invalid task ID' });
        return;
    }

    const taskId = parseInt(req.params.id as string);
    if(isNaN(taskId)) {
        res.status(400).json({ message: 'Invalid task ID' });
        return;
    }

    const response = await taskService.deleteTask(taskId);
    if(response.status !== 'success') {
        res.status(400).json(response);
        return;
    }
    res.json(response);
};

export const setIsCompleted = async (req: Request, res: Response): Promise<void> => {
    if(!req.user) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }

    if(!req.params.id) {
        res.status(400).json({ message: 'Invalid task ID' });
        return;
    }

    const taskId = parseInt(req.params.id as string);
    if(isNaN(taskId)) {
        res.status(400).json({ message: 'Invalid task ID' });
        return;
    }

    const response = await taskService.setIsCompleted(taskId, req.body.isCompleted);
    if(response.status !== 'success') {
        res.status(400).json(response);
        return;
    }
    res.json(response);
};

export const filterTasks = async (req: Request, res: Response): Promise<void> => {
    if(!req.user) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }

    if(!req.body.listId) {
        res.status(400).json({ message: 'Invalid ID' });
        return;
    }

    const id = parseInt(req.body.list_id as string);
    if(isNaN(id)) {
        res.status(400).json({ message: 'Invalid ID' });
        return;
    }

    const response = await taskService.filterTasks(id, req.body.filter);
    if(response.status !== 'success') {
        res.status(400).json(response);
        return;
    }
    res.json(response);
};
