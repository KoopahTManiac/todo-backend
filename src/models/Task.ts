import { pool } from '../config/database';

export interface Task {
    id: number;
    title: string;
    todoListId: number;
    taskId: number | null;
    description: string;
    isCompleted: boolean;
    order: number;
}

class TaskModel {
    createTask(title: string, description: string, todoListId: number): Task {
        // TODO: Implement create todo
    }

    getTasks(todoListId: number): Task[] {
        // TODO: Implement get todos
    }

    getTasksById(id: number): Task {
        // TODO: Implement get todo by id
    }

    updateTask(id: number, title: string, description: string, isCompleted: boolean): Task {
        // TODO: Implement update todo
    }

    deleteTask(id: number): void {
        // TODO: Implement delete todo
    }

    changeTaskOrder(id: number, order: number): void {
        // TODO: Implement change todo order
    }
}
export default new TaskModel();

