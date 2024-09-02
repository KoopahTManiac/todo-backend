import { Request, Response } from 'express';
import ws from 'ws';
import todoService from '../services/todoService';
import taskService from '../services/taskService';

const subscriptions: Map<number, Set<ws>> = new Map();

enum WebsocketCommands {
    Subscribe = 'subscribe',
    AddTask = 'add-task',
    UpdateTask = 'update-task',
    DeleteTask = 'delete-task',
    SetIsCompleted = 'set-is-completed-task',
    FilterTasks = 'filter-tasks',
}

enum WebsocketResponses {
    TaskSubscribed = 'task-subscribed',
    TaskAdded = 'task-added',
    TaskUpdated = 'task-updated',
    TaskDeleted = 'task-deleted',
    TaskIsCompletedUpdated = 'task-is-completed-updated',
    TasksFiltered = 'tasks-filtered',
}

export const createTodoList = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }

    const response = await todoService.createTodoList(req.body.title, req.user?.id);
    if (response.status !== 'success') {
        res.status(400).json(response);
        return;
    }
    res.json(response);
};

export const getTodoLists = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }

    const response = await todoService.getTodoLists(req.user?.id);
    if (response.status !== 'success') {
        res.status(400).json(response);
        return;
    }
    res.json(response);
};

export const getTodoListById = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }

    const id = parseInt(req.params.id as string);
    if (isNaN(id)) {
        res.status(400).json({ message: 'Invalid ID' });
        return;
    }

    const response = await todoService.getTodoListById(id);
    if (response.status !== 'success') {
        res.status(400).json(response);
        return;
    }
    res.json(response);
};

export const updateTodoList = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }

    const id = parseInt(req.params.id as string);
    if (isNaN(id)) {
        res.status(400).json({ message: 'Invalid ID' });
        return;
    }

    if (!req.body.title) {
        res.status(400).json({ message: 'Title is required' });
        return;
    }

    const response = await todoService.updateTodoList(id, req.body.title);
    if (response.status !== 'success') {
        res.status(400).json(response);
        return;
    }
    res.json(response);
};

export const deleteTodoList = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }

    const id = parseInt(req.params.id as string);
    if (isNaN(id)) {
        res.status(400).json({ message: 'Invalid ID' });
        return;
    }

    const response = await todoService.deleteTodoList(id);
    if (response.status !== 'success') {
        res.status(400).json(response);
        return;
    }
    res.json(response);
};

export const generateTodoListURL = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }

    if (!req.params.id) {
        res.status(400).json({ message: 'Invalid ID' });
        return;
    }

    const id = parseInt(req.params.id as string);
    if (isNaN(id)) {
        res.status(400).json({ message: 'Invalid ID' });
        return;
    }

    const response = await todoService.generateTodoListURL(id);
    if (response.status !== 'success') {
        res.status(400).json(response);
        return;
    }
    res.json(response);
};

const broadcast = (message: object, id: number, sender?: ws) => {
    const clients = subscriptions.get(id);
    if (clients) {
        clients.forEach((client) => {
            if (client !== sender && client.readyState === ws.OPEN) {
                client.send(JSON.stringify(message));
            }
        });
    }
};

export const wsTodoList = async (ws: ws, req: Request): Promise<void> => {
    if (req.params.id && Number.isNaN(parseInt(req.params.id))) {
        ws.send(JSON.stringify({ type: 'error', message: 'Invalid ID' }));
        ws.close();
        return;
    }

    const id = parseInt(req.params.id);

    ws.on('message', async (message: string) => {
        const data = JSON.parse(message);

        switch (data.type) {
            case WebsocketCommands.Subscribe:
                await handleSubscribe(ws, data, id);
                break;

            case WebsocketCommands.AddTask:
                await handleAddTask(ws, data, id);
                break;

            case WebsocketCommands.UpdateTask:
                await handleUpdateTask(ws, data, id);
                break;

            case WebsocketCommands.DeleteTask:
                await handleDeleteTask(ws, data, id);
                break;

            case WebsocketCommands.SetIsCompleted:
                await handleSetIsCompleted(ws, data, id);
                break;

            case WebsocketCommands.FilterTasks:
                await handleFilterTasks(ws, data, id);
                break;

            default:
                ws.send(JSON.stringify({ type: 'error', message: 'Unknown command type' }));
        }
    });

    ws.on('close', () => {
        subscriptions.forEach((clients, listId) => {
            if (clients.has(ws)) {
                clients.delete(ws);
                if (clients.size === 0) {
                    subscriptions.delete(listId);
                }
            }
        });
        console.log('WebSocket closed');
    });

    ws.on('error', (error: Error) => {
        console.error('WebSocket error:', error);
    });
};



async function handleSubscribe(ws: any, data: any, id: number) {
    if (!subscriptions.has(id)) {
        subscriptions.set(id, new Set());
    }
    subscriptions.get(id)!.add(ws);

    // Send initial tasks when subscribed
    const response = await taskService.getTasks(id);
    if (response.status !== 'success') {
        ws.send(JSON.stringify({ type: 'error', message: response.message }));
        return;
    }
    ws.send(JSON.stringify({ type: WebsocketResponses.TaskSubscribed, tasks: response.tasks }));
}

async function handleAddTask(ws: any, data: any, id: number) {
    const response = await taskService.createTask(id, data.payload.title, data.payload.description);
    if (response.status !== 'success') {
        ws.send(JSON.stringify({ type: 'error', message: response.message }));
        return;
    }
    const taskMessage = { type: WebsocketResponses.TaskAdded, task: response.task };
    ws.send(JSON.stringify(taskMessage));
    broadcast(taskMessage, id, ws);
}

async function handleUpdateTask(ws: any, data: any, id: number) {
    const response = await taskService.updateTask(
        id,
        data.payload.id,
        data.payload.title,
        data.payload.description,
        data.payload.isCompleted
    );
    if (response.status !== 'success') {
        ws.send(JSON.stringify({ type: 'error', message: response.message }));
        return;
    }
    const updateMessage = { type: WebsocketResponses.TaskUpdated, task: response.task };
    ws.send(JSON.stringify(updateMessage));
    broadcast(updateMessage, id, ws);
}

async function handleDeleteTask(ws: any, data: any, id: number) {
    const response = await taskService.deleteTask(data.payload.id);
    if (response.status !== 'success') {
        ws.send(JSON.stringify({ type: 'error', message: response.message }));
        return;
    }
    const deleteMessage = { type: WebsocketResponses.TaskDeleted, taskId: data.payload.id };
    ws.send(JSON.stringify(deleteMessage));
    broadcast(deleteMessage, id, ws);
}

// Function to handle setting a task as completed
async function handleSetIsCompleted(ws: any, data: any, id: number) {
    const response = await taskService.setIsCompleted(data.payload.id, data.payload.is_completed);
    if (response.status !== 'success') {
        ws.send(JSON.stringify({ type: 'error', message: response.message }));
        return;
    }
    const completeMessage = { type: WebsocketResponses.TaskIsCompletedUpdated, task: response.task };
    ws.send(JSON.stringify(completeMessage));
    broadcast(completeMessage, id, ws);
}

// Function to handle filtering tasks
async function handleFilterTasks(ws: any, data: any, id: number) {
    const response = await taskService.filterTasks(id, data.payload.filter);
    if (response.status !== 'success') {
        ws.send(JSON.stringify({ type: 'error', message: response.message }));
        return;
    }
    ws.send(JSON.stringify({ type: WebsocketResponses.TasksFiltered, tasks: response.tasks }));
}