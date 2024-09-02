import { Query, QueryResult } from 'pg';
import { pool } from '../config/database';

export interface Task {
    id: number | null;
    title: string;
    todo_list_id: number;
    task_id?: number;
    description: string;
    is_completed: boolean;
    sub_tasks?: Task[];
}

export enum TaskFilterType {
    ALL = 'all',
    ACTIVE = 'active',
    COMPLETED = 'completed',
}

class TaskModel {

    /**
     * Creates a new task.
     * 
     * @param title - The title of the task.
     * @param description - The description of the task.
     * @param todoListId - The ID of the todo list the task belongs to.
     * @param taskID - The ID of the task that this task is a subtask of.
     * @returns A promise that resolves to the created task or null if the task could not be created.
     */
    async createTask(title: string, description: string, todoListId: number, taskID?: number): Promise<Task | null> {
        
        const result: QueryResult<Task> = await pool.query(
            'INSERT INTO tasks (title, description, todo_list_id, task_id, is_completed) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [
                title, 
                description, 
                todoListId, 
                taskID,
                false
            ]);

        return result.rows[0] || null;
    }

    /**
     * Retrieves all tasks for a todo list and its sub tasks.
     * 
     * @param todoListId - The ID of the todo list.
     * @returns A promise that resolves to an array of tasks and sub tasks or null if the tasks could not be retrieved.
     */
    async getTasks(todoListId: number): Promise<Task[]> {
        const result: QueryResult = await pool.query(
            `SELECT * FROM tasks WHERE todo_list_id = $1`,
            [todoListId]
        );
    
        const tasks: Task[] = [];

        // filter out sub tasks
        const topLevelTasks = result.rows.filter(task => !task.taskId);

        // add top level tasks to the tasks array
        tasks.push(...topLevelTasks);

        // add sub tasks to the tasks array
        const subTasks = result.rows.filter(task => task.taskId);
        for (const task of subTasks) {
            const parentTask = tasks.find(t => t.id === task.taskId);
            if (parentTask) {
                parentTask.sub_tasks = parentTask.sub_tasks || [];
                parentTask.sub_tasks.push(task);
            }
        }

        return tasks;
    }

        /**
     * Retrieves all tasks for a todo list and its sub tasks based on a filter.
     * 
     * @param todoListId - The ID of the todo list.
     * @returns A promise that resolves to an array of tasks and sub tasks or null if the tasks could not be retrieved.
     */
    async getFilteredTasks(todoListId: number, isCompleted: boolean): Promise<Task[]> {
        const tasks = await this.getTasks(todoListId);

        return tasks.filter(task => {
            if(isCompleted) {
                // find all completed tasks check if all of their subtasks are completed
                return task.is_completed || task.sub_tasks?.every(subtask => subtask.is_completed);
            } else {
                // find all non-completed tasks and check if any of their subtasks are not completed
                return !task.is_completed || task.sub_tasks?.some(subtask => !subtask.is_completed);
            }

        });
    }

    /**
     * Retrieves a task by its ID.
     * 
     * @param id - The ID of the task.
     * @returns A promise that resolves to the task or null if the task could not be retrieved.
     */
    async getTasksById(id: number): Promise<Task> {
        const result: QueryResult<Task> = await pool.query(
            'SELECT * FROM tasks WHERE id = $1',
            [id]
        );

        return result.rows[0] || null;
    }

    /**
     * Updates a task.
     * 
     * @param id - The ID of the task to update.
     * @param title - The new title of the task.
     * @param description - The new description of the task.
     * @param isCompleted - The new isCompleted status of the task.
     * @returns The updated task object or null if the task could not be updated.
     */
    async updateTask(id: number, title: string, description: string, isCompleted: boolean): Promise<Task> {
        const result: QueryResult<Task> = await pool.query(
            'UPDATE tasks SET title = $1, description = $2, is_completed = $3 WHERE id = $4 RETURNING *',
            [title, description, isCompleted, id]
        );

        return result.rows[0] || null;
    }

    /**
     * Sets the isCompleted status of a task.
     * 
     * @param id - The ID of the task to mark as done.
     * @param isCompleted - The new isCompleted status of the task.
     * @returns The updated task object or null if the task could not be updated.
     */
    async setIsCompleted(id: number, isCompleted: boolean): Promise<Task> {
        const result: QueryResult<Task> = await pool.query(
            'UPDATE tasks SET is_completed = $1 WHERE id = $2 RETURNING *',
            [isCompleted, id]
        );

        return result.rows[0] || null;
    }

    /**
     * Deletes a task.
     * 
     * @param id - The ID of the task to delete.
     * @returns A promise that resolves to void.
     */
    async deleteTask(id: number): Promise<boolean> {
        const result: QueryResult = await pool.query('DELETE FROM tasks WHERE id = $1', [id]);

        return result.rowCount === 1;
    }

   /**
    * Filters tasks based on a filter type.
    * 
    * @param listId - The ID of the todo list.
    * @param filter - The filter type to apply.
    * @returns A promise that resolves to an array of tasks or null if the tasks could not be retrieved.
    */
    async filterTasks(listId: number, filter: TaskFilterType): Promise<Task[] | null> {

        switch (filter) {
            case TaskFilterType.ALL:
                return await this.getTasks(listId);
            case TaskFilterType.ACTIVE:
                return await this.getFilteredTasks(listId, true);
            case TaskFilterType.COMPLETED:
                return await this.getFilteredTasks(listId, false);
            default:
                throw new Error('Invalid filter type');
        }
        return null;
    }
    
}
export default new TaskModel();

