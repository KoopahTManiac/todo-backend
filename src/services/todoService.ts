import { Task, default as TaskModel} from '../models/Task';
import { TodoList, default as TodoListModel } from '../models/TodoList';

class TodoService {

    createTodoList(title: string, userId: number): TodoList {
        return TodoListModel.createTodoList(title, userId);
    }

    addTodo(listId: string, title: string, description: string, userId: number): Task | null {
        return TaskModel.createTask(title, description, userId);
    }

    getTodoLists(userId: number): TodoList[] {
        return TodoListModel.getTodoLists();
    }

    getTodos(listId: number): Task[] {
        return TaskModel.getTasks(listId);
    }

    updateTodoList(listId: number, title: string): TodoList {
        return TodoListModel.updateTodoList(listId, title);
    }

    deleteTodoList(listId: number): void {
        TodoListModel.deleteTodoList(listId);
    }

    generateTodoListURL(listId: number): string {
        return TodoListModel.generateTodoListURL(listId);
    }
    
}

export default new TodoService();

