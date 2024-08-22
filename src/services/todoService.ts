interface TodoList {
    id: number;
    title: string;
}

interface Todo {
    id: number;
    title: string;
    description: string;
    isCompleted: boolean;
}

class TodoService {

    createTodoList(title: string): TodoList {
        // TODO: Implement create todo list
    }

    addTodo(listId: string, title: string, description: string): Todo | null {
        // TODO: Implement add todo
    }

    getTodoLists(): TodoList[] {
        // TODO: Implement get todo lists
    }

    getTodos(listId: string): Todo[] {
        // TODO: Implement get todo list by id
    }

    updateTodoList(listId: string, title: string): TodoList {
        // TODO: Implement update todo list
    }

    deleteTodoList(listId: string): void {
        // TODO: Implement delete todo list
    }

    generateTodoListURL(listId: string): string {
        // TODO: Implement generate todo list url
    }
    
}

export default new TodoService();

