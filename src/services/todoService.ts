import { PostgresError } from 'pg-error-enum';
import { Task, default as TaskModel} from '../models/Task';
import { TodoList, default as TodoListModel } from '../models/TodoList';
import userService from './userService';

/**
 * Todo status interface containing a status, message, and optional data like todo list or URL
 * 
 * @var status: Status code, @see TodoStatusCode
 * @var message: string containing the status message
 * @var todoList?: optional TodoList if status is SUCCESS and todoList is expected
 * @var url?: optional url string if status is SUCCESS and url is expected
 */
export interface TodoStatus {
    status: TodoStatusCode;
    message: string;
    todoList?: TodoList;
    url?: string;
}

/**
 * Todo status list interface containing a status, message, and optional data like todo lists
 * 
 * @see TodoStatus
 * @var todoLists?: optional TodoList[] if status is SUCCESS and todoLists is expected
 */
export interface TodoStatusList {
    status: TodoStatusCode;
    message: string;
    todoLists?: TodoList[];
}

/**
 * Todo status code enum
 * 
 * SUCCESS: The operation was successful
 * ERROR: The operation failed
 */
export enum TodoStatusCode {
    SUCCESS = 'success',
    ERROR = 'error',
}


class TodoService {

    /**
     * Creates a new todo list for the given user
     * 
     * @param title: string containing the title of the todo list
     * @param userId: number containing the user ID
     * @returns TodoStatus containing the status, message, and optional data
     */
    async createTodoList(title: string, userId: number): Promise<TodoStatus> {
        try {
            const user = await userService.getUserById(userId);

            if(!user.safeUser) {
                return { status: TodoStatusCode.ERROR, message: 'User not found' };
            }

            const todoList = await TodoListModel.createTodoList(title, userId);

            if(!todoList) {
                return { status: TodoStatusCode.ERROR, message: 'Failed to create todo list' };
            }

            return { status: TodoStatusCode.SUCCESS, message: 'Todo list created', todoList };
        } catch (error: any) {

            console.error('Error creating todo list:', error);
            return { status: TodoStatusCode.ERROR, message: 'Internal server error' };
        }
    }

    /**
     * Gets all todo lists for the given user
     * 
     * @param userId: number containing the user ID
     * @returns TodoStatusList containing the status, message, and optional data
     */
    async getTodoLists(userId: number): Promise<TodoStatusList> {
        try {
            const todoLists = await TodoListModel.getTodoLists(userId);
            if(!todoLists) {
                return { status: TodoStatusCode.ERROR, message: 'Failed to get todo lists' };
            }
            return { status: TodoStatusCode.SUCCESS, message: 'Todo lists retrieved', todoLists };
        } catch (error) {
            console.error('Error getting todo lists:', error);
            return { status: TodoStatusCode.ERROR, message: 'Internal server error' };
        }
    }

    /**
     * Gets a todo list by its ID
     * 
     * @param listId: number containing the ID of the todo list
     * @returns TodoStatus containing the status, message, and optional data
     */
    async getTodoListById(listId: number): Promise<TodoStatus> {
        try {
            const todoList = await TodoListModel.getTodoListById(listId);
            if(!todoList) {
                return { status: TodoStatusCode.ERROR, message: 'Failed to get todo list' };
            }
            return { status: TodoStatusCode.SUCCESS, message: 'Todo list retrieved', todoList };
        } catch (error) {
            console.error('Error getting todo list:', error);
            return { status: TodoStatusCode.ERROR, message: 'Internal server error' };
        }
    }

    /**
     * Updates the title of the todo list with the given ID
     * 
     * @param listId: number containing the ID of the todo list
     * @param title: string containing the new title of the todo list
     * @returns TodoStatus containing the status, message, and optional data
     */
    async updateTodoList(listId: number, title: string): Promise<TodoStatus> {
        try {
            const todoList = await TodoListModel.updateTodoList(listId, title);
            if(!todoList) {
                return { status: TodoStatusCode.ERROR, message: 'Failed to update todo list' };
            }
            return { status: TodoStatusCode.SUCCESS, message: 'Todo list updated', todoList };
        } catch (error) {
            console.error('Error updating todo list:', error);
            return { status: TodoStatusCode.ERROR, message: 'Internal server error' };
        }
    }

    /**
     * Deletes the todo list with the given ID
     * 
     * @param listId: number containing the ID of the todo list
     * @returns TodoStatus containing the status, message, and optional data
     */
    async deleteTodoList(listId: number): Promise<TodoStatus> {
        try {
            const result = await TodoListModel.deleteTodoList(listId);
            if(!result) {
                return { status: TodoStatusCode.ERROR, message: 'Failed to delete todo list' };
            }
            return { status: TodoStatusCode.SUCCESS, message: 'Todo list deleted' };
        } catch (error) {
            console.error('Error deleting todo list:', error);
            return { status: TodoStatusCode.ERROR, message: 'Internal server error' };
        }
    }

    /**
     * Generates a URL for the given todo list
     * 
     * @param listId: number containing the ID of the todo list
     * @returns TodoStatus containing the status, message, and optional data
     */
    async generateTodoListURL(listId: number): Promise<TodoStatus> {
        try {
            const url = await TodoListModel.generateTodoListURL(listId);
            if(!url) {
                return { status: TodoStatusCode.ERROR, message: 'Failed to generate URL' };
            }
            return { status: TodoStatusCode.SUCCESS, message: 'URL generated', url };
        } catch (error) {
            console.error('Error generating todo list URL:', error);
            return { status: TodoStatusCode.ERROR, message: 'Internal server error' };
        }
    }
    
    /**
     * Updates the isLocked status of the todo list with the given ID
     * 
     * @param listId: number containing the ID of the todo list
     * @param isLocked: boolean indicating whether the todo list is locked or not
     * @returns TodoStatus containing the status, message, optional todolist if status is SUCCESS
     */
    async updateTodoListIsLocked(listId: number, isLocked: boolean): Promise<TodoStatus> {
        try {
            const todoList = await TodoListModel.updateTodoListIsLocked(listId, isLocked);
            if(!todoList) {
                return { status: TodoStatusCode.ERROR, message: 'Failed to update todo list isLocked' };
            }
            return { status: TodoStatusCode.SUCCESS, message: 'Todo list isLocked updated', todoList };
        } catch (error) {
            console.error('Error updating todo list isLocked:', error);
            return { status: TodoStatusCode.ERROR, message: 'Internal server error' };
        }
    }
}

export default new TodoService();

