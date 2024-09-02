import { expect } from 'chai';
import { Task, default as TaskModel, TaskFilterType } from '../models/Task';
import { todo } from 'node:test';
import todoService, { TodoStatusCode } from './todoService';
import { stat } from 'fs';

export interface TaskStatus {
    status: TaskStatusCode;
    message: string;
    task?: Task;
    error?: string;
}

export interface TaskStatusList {
    status: TaskStatusCode;
    message: string;
    tasks?: Task[];
    error?: string;
}

export enum TaskStatusCode {
    SUCCESS = 'success',
    ERROR = 'error',
}


class TaskService {

    async createTask(listId: number, title: string, description: string, taskId?: number): Promise<TaskStatus> {
        try {
            const listStatus = await todoService.getTodoListById(listId);
            const listExists = listStatus.status === TodoStatusCode.SUCCESS && listStatus.todoList;
            if(!listExists) {
                return { status: TaskStatusCode.ERROR, message: 'Failed to create task - todo list not found' };
            }
            const task = await TaskModel.createTask(title, description, listId, taskId);
            if(!task) {
                return { status: TaskStatusCode.ERROR, message: 'Failed to create task' };
            }
            return { status: TaskStatusCode.SUCCESS, message: 'Task created', task };
        } catch (error: any) {
            return { status: TaskStatusCode.ERROR, message: 'Internal server error', error };
        }
    }

    async getTasks(listId: number): Promise<TaskStatusList> {
        try {
            const status = await todoService.getTodoListById(listId);
            if(status.status !== TodoStatusCode.SUCCESS || !status.todoList) {
                return { status: TaskStatusCode.ERROR, message: 'Failed to get tasks - todo list not found' };
            }
            const tasks = await TaskModel.getTasks(listId);
            if(!tasks) {
                return { status: TaskStatusCode.ERROR, message: 'Failed to get tasks' };
            }
            return { status: TaskStatusCode.SUCCESS, message: 'Tasks retrieved', tasks };
        } catch (error: any) {
            return { status: TaskStatusCode.ERROR, message: 'Internal server error', error };
        }
    }

    async getTaskById(taskId: number): Promise<TaskStatus> {
        try {
            const task = await TaskModel.getTasksById(taskId);
            if(!task) {
                return { status: TaskStatusCode.ERROR, message: 'Failed to get task' };
            }
            return { status: TaskStatusCode.SUCCESS, message: 'Task retrieved', task };
        } catch (error: any) {
            return { status: TaskStatusCode.ERROR, message: 'Internal server error', error };
        }
    }

    async updateTask(taskId: number, title: string, description: string, isCompleted: boolean): Promise<TaskStatus> {
        try {
            const task = await TaskModel.updateTask(taskId, title, description, isCompleted);
            if(!task) {
                return { status: TaskStatusCode.ERROR, message: 'Failed to update task' };
            }
            return { status: TaskStatusCode.SUCCESS, message: 'Task updated', task };
        } catch (error: any) {
            return { status: TaskStatusCode.ERROR, message: 'Internal server error', error };
        }
    }

    async deleteTask(taskId: number): Promise<TaskStatus> {
        try {
            const result = await TaskModel.deleteTask(taskId);
            if(!result) {
                return { status: TaskStatusCode.ERROR, message: 'Task not found or error deleting task'};
            }
            return { status: TaskStatusCode.SUCCESS, message: 'Task deleted' };
        } catch (error: any) {
            return { status: TaskStatusCode.ERROR, message: 'Internal server error', error };
        }
    }

    async setIsCompleted( taskId: number, isCompleted: boolean): Promise<TaskStatus> {
        try {
            const task = await TaskModel.setIsCompleted(taskId, isCompleted);
            if(!task) {
                return { status: TaskStatusCode.ERROR, message: 'Failed to mark task as done' };
            }
            return { status: TaskStatusCode.SUCCESS, message: 'Task marked as done', task };
        } catch (error: any) {
            return { status: TaskStatusCode.ERROR, message: 'Internal server error', error };
        }
    }

    async filterTasks(listId: number, filter: TaskFilterType): Promise<TaskStatusList> {
        try {
            const tasks = await TaskModel.filterTasks(listId, filter);
            if(!tasks) {
                return { status: TaskStatusCode.ERROR, message: 'Failed to filter tasks' };
            }
            return { status: TaskStatusCode.SUCCESS, message: 'Tasks filtered', tasks };
        } catch (error: any) {
            return { status: TaskStatusCode.ERROR, message: 'Internal server error', error };
        }
    }

}

export default new TaskService();