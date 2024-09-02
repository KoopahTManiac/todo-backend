import { pool } from '../config/database';
import { Task, default as TaskModel } from './Task';

export interface TodoList {
    id: number;
    title: string;
    tasks: Task[] | null;
    userId: number;
}

class TodoListModel {
    createTodoList(title: string, userId: number): TodoList {
        // TODO: Implement create todo list
    }

    getTodoLists(): TodoList[] {
        // TODO: Implement get todo lists
    }

    updateTodoList(listId: number, title: string): TodoList {
        // TODO: Implement update todo list
    }

    deleteTodoList(listId: number): void {
        // TODO: Implement delete todo list
    }

    generateTodoListURL(listId: number): string {
        // TODO: Implement generate todo list url
    }
    
}

export default new TodoListModel();