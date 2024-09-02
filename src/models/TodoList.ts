import { FRONTEND_HOST, FRONTEND_PORT } from '../config/config';
import { pool } from '../config/database';
import { Task, default as TaskModel } from './Task';

export interface TodoList {
    id: number;
    title: string;
    tasks: Task[] | null;
    user_id: number;
    is_locked: boolean;
}

class TodoListModel {
    async createTodoList(title: string, userId: number): Promise<TodoList | null> {
        const result = await pool.query(
            'INSERT INTO todo_lists (title, user_id) VALUES ($1, $2) RETURNING *',
            [title, userId]
        );

        return result.rows[0] || null;
    }

    async getTodoLists(userId: number): Promise<TodoList[] | null> {
        const result = await pool.query(
            'SELECT * FROM todo_lists WHERE user_id = $1',
            [userId]
        );

        return result.rows;
    }

    async getTodoListById(listId: number): Promise<TodoList | null> {
        const result = await pool.query('SELECT * FROM todo_lists WHERE id = $1', [listId]);

        return result.rows[0] || null;
    }

    async updateTodoList(listId: number, title: string): Promise<TodoList | null> {
        const result = await pool.query(
            'UPDATE todo_lists SET title = $1 WHERE id = $2 RETURNING *',
            [title, listId]
        );

        return result.rows[0] || null;
    }

    async updateTodoListIsLocked(listId: number, isLocked: boolean): Promise<TodoList | null> {
        const result = await pool.query(
            'UPDATE todo_lists SET is_locked = $1 WHERE id = $2 RETURNING *',
            [isLocked, listId]
        );

        return result.rows[0] || null;
    }

    async deleteTodoList(listId: number): Promise<boolean> {
        const result = await pool.query('DELETE FROM todo_lists WHERE id = $1', [listId]);

        return result.rowCount === 1;
    }

    async generateTodoListURL(listId: number): Promise<string | null> {
        const result = await pool.query('SELECT todo_lists.id, todo_lists.title FROM todo_lists WHERE todo_lists.id = $1', [listId]);

        return result.rows.length > 0 ? `https://${FRONTEND_HOST}:${FRONTEND_PORT}/shared/${result.rows[0].id}` : null;
    }

    /**
     * Retrieves a todo list with all tasks and subtasks
     * 
     * @param listId - The ID of the todo list.
     * @returns A promise that resolves to a todo list with its tasks, or null if not found.
     */
    async getTodoListWithTasks(listId: number): Promise<TodoList | null> {
        const result = await pool.query('SELECT * FROM todo_lists WHERE id = $1', [listId]);

        if (result.rows.length === 0) {
            return null;
        }

        const todoList: TodoList = result.rows[0];

        // Fetch tasks associated with this todo list
        const tasks: Task[] = await TaskModel.getTasks(todoList.id);

        return {
            ...todoList,
            tasks: tasks.length > 0 ? tasks : null
        };
    }

}

export default new TodoListModel();