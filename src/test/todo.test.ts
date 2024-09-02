import { expect } from 'chai';
import { dropTables, createTables } from '../setup/database.setup';
import taskService, { TaskStatusCode } from '../services/taskService';
import userService, { UserStatusCode } from '../services/userService';
import todoService, { TodoStatusCode } from '../services/todoService';
import { toSafeUser, User } from '../models/User';
import exp from 'constants';


describe('User Service', () => {
    before(async () => {
        await dropTables();
        await createTables();
    });
    describe('createUser', () => {
        it('should create a user', async () => {
            const response = await userService.createUser('testuser', 'testpassword');
            expect(response.status).to.equal(UserStatusCode.SUCCESS);
            expect(response.message).to.equal('User created');
            expect(response.safeUser).to.be.an('object');
            expect(response.safeUser?.username).to.equal('testuser');
            expect(response.safeUser?.password).to.equal(null);
        });

        it('should return an error if the user could not be created', async () => {
            const response = await userService.createUser('testuser', 'testpassword');
            expect(response.status).to.equal(UserStatusCode.ERROR);
            expect(response.message).to.equal('Username already exists or error creating user');
        });
    });

    describe('getUserById', () => {
        it('should get a user by ID', async () => {
            const response = await userService.getUserById(1);
            expect(response.status).to.equal(UserStatusCode.SUCCESS);
            expect(response.message).to.equal('User found');            
            expect(response.safeUser).to.be.an('object');
            expect(response.safeUser?.username).to.equal('testuser');
            expect(response.safeUser?.password).to.equal(null);
        });

        it('should return an error if the user could not be found', async () => {
            const response = await userService.getUserById(100);
            expect(response.status).to.equal(UserStatusCode.ERROR);
            expect(response.message).to.equal('User not found');
        });
    });

    describe('updateUser', () => {
        it('should update the username and password of the user', async () => {
            const response = await userService.updateUser(1, 'newusername', 'newpassword');
            expect(response.status).to.equal(UserStatusCode.SUCCESS);
            expect(response.message).to.equal('User updated');
            expect(response.safeUser).to.be.an('object');
            expect(response.safeUser?.username).to.equal('newusername');
            expect(response.safeUser?.password).to.equal(null);
        });

        it('should return an error if the user could not be updated', async () => {
            const response = await userService.updateUser(-1, 'newusername', 'newpassword');
            expect(response.status).to.equal(UserStatusCode.ERROR);
            expect(response.message).to.equal('User not found or error updating user');
        });
    });

    describe('loginUser', () => {
        it('should login a user', async () => {
            const response = await userService.loginUser('newusername', 'newpassword');
            expect(response.status).to.equal(UserStatusCode.SUCCESS);
            expect(response.message).to.equal('User logged in');
            expect(response.safeUser).to.be.an('object');
            expect(response.safeUser?.username).to.equal('newusername');
            expect(response.safeUser?.password).to.equal(null);
            expect(response.authKey).to.be.a('object');
        });

        it('should return an error if wrong password is provided', async () => {
            const response = await userService.loginUser('newusername', 'wrongpassword');
            expect(response.status).to.equal(UserStatusCode.ERROR);
            expect(response.message).to.equal('Incorrect password');
        });

        it('should return an error if wrong username is provided', async () => {
            const response = await userService.loginUser('wrongusername', 'wrongpassword');
            expect(response.status).to.equal(UserStatusCode.ERROR);
            expect(response.message).to.equal('User not found');
        });
    });
});

describe('todo Service', () => {
    describe('createTodoList', () => {
        it('should create a todo list', async () => {
            const response = await todoService.createTodoList('Test List', 1);
            expect(response.status).to.equal(TodoStatusCode.SUCCESS);
            expect(response.message).to.equal('Todo list created');
            expect(response.todoList).to.be.an('object');
            expect(response.todoList?.title).to.equal('Test List');
        });

        it('should return an error if the todo list could not be created', async () => {
            const response = await todoService.createTodoList('Test List', -1);
            expect(response.status).to.equal(TodoStatusCode.ERROR);
            expect(response.message).to.equal('User not found');
        });
    });

    describe('getTodoLists', () => {
        it('should get all todo lists', async () => {
            const response = await todoService.getTodoLists(1);
            expect(response.status).to.equal(TodoStatusCode.SUCCESS);
            expect(response.message).to.equal('Todo lists retrieved');
            expect(response.todoLists).to.be.an('array');
            expect(response.todoLists?.length).to.equal(1);
        });        
    });

    describe('getTodoListById', () => {
        it('should get a todo list by ID', async () => {
            const response = await todoService.getTodoListById(1);
            expect(response.status).to.equal(TodoStatusCode.SUCCESS);
            expect(response.message).to.equal('Todo list retrieved');
            expect(response.todoList).to.be.an('object');
            expect(response.todoList?.title).to.equal('Test List');
        });

        it('should return an error if the todo list could not be found', async () => {
            const response = await todoService.getTodoListById(-1);
            expect(response.status).to.equal(TodoStatusCode.ERROR);
            expect(response.message).to.equal('Failed to get todo list');
        });
    });

    describe('updateTodoList', () => {
        it('should update the title of the todo list', async () => {
            const response = await todoService.updateTodoList(1, 'New Title');
            expect(response.status).to.equal(TodoStatusCode.SUCCESS);
            expect(response.message).to.equal('Todo list updated');
            expect(response.todoList).to.be.an('object');
            expect(response.todoList?.title).to.equal('New Title');
        });

        it('should return an error if the todo list could not be updated', async () => {
            const response = await todoService.updateTodoList(-1, 'New Title');
            expect(response.status).to.equal(TodoStatusCode.ERROR);
            expect(response.message).to.equal('Failed to update todo list');
        });
    });

    describe('generateTodoListURL', () => {
        it('should generate a URL for the todo list', async () => {
            const response = await todoService.generateTodoListURL(1);
            expect(response.status).to.equal(TodoStatusCode.SUCCESS);
            expect(response.message).to.equal('URL generated');
            expect(response.url).to.be.a('string');
        });

        it('should return an error if the todo list could not be generated', async () => {
            const response = await todoService.generateTodoListURL(-1);
            expect(response.status).to.equal(TodoStatusCode.ERROR);
            expect(response.message).to.equal('Failed to generate URL');
        });
    });
});

describe('Task Service', () => {
    describe('createTask', () => {
        it('should create a task', async () => {
            const response = await taskService.createTask(1, 'Test Task', 'Test Description');
            expect(response.status).to.equal(TaskStatusCode.SUCCESS);
            expect(response.message).to.equal('Task created');
            expect(response.task).to.be.an('object');
            expect(response.task?.title).to.equal('Test Task');
        });
            
        it('should return an error if the task could not be created', async () => {
            const response = await taskService.createTask(-1, 'Test Task', 'Test Description');
            expect(response.status).to.equal(TaskStatusCode.ERROR);
            expect(response.message).to.equal('Failed to create task - todo list not found');
        });
    });

    describe('getTasks', () => {
        it('should get all tasks', async () => {
            const response = await taskService.getTasks(1);
            expect(response.status).to.equal(TaskStatusCode.SUCCESS);
            expect(response.message).to.equal('Tasks retrieved');
            expect(response.tasks).to.be.an('array');
            expect(response.tasks?.length).to.equal(1);
        });

        it('should return an error if the todo list could not be found', async () => {
            const response = await taskService.getTasks(-1);
            expect(response.status).to.equal(TaskStatusCode.ERROR);
            expect(response.message).to.equal('Failed to get tasks - todo list not found');
        });
    });
});

describe('Task Service Delete', () => {
    describe('deleteTask', () => {
        it('should delete the task', async () => {
            const response = await taskService.deleteTask(1);
            expect(response.status).to.equal(TaskStatusCode.SUCCESS);
            expect(response.message).to.equal('Task deleted');
        });

        it('should return an error if the task could not be deleted', async () => {
            const response = await taskService.deleteTask(-1);
            expect(response.status).to.equal(TaskStatusCode.ERROR);
            expect(response.message).to.equal('Task not found or error deleting task');
        });
    });
});


describe('Todo Service Delete', () => {
    describe('deleteTodoList', () => {
        it('should delete the todo list', async () => {
            const response = await todoService.deleteTodoList(1);
            expect(response.status).to.equal(TodoStatusCode.SUCCESS);
            expect(response.message).to.equal('Todo list deleted');
        });

        it('should return an error if the todo list could not be deleted', async () => {
            const response = await todoService.deleteTodoList(-1);
            expect(response.status).to.equal(TodoStatusCode.ERROR);
            expect(response.message).to.equal('Failed to delete todo list');
        });
    });
});

describe('UserServiceDelete', () => {
    describe('deleteUser', () => {
        it('should delete the user', async () => {
            const response = await userService.deleteUser(1);
            expect(response.status).to.equal(UserStatusCode.SUCCESS);
            expect(response.message).to.equal('User deleted');
        });

        it('should return an error if the user could not be deleted', async () => {
            const response = await userService.deleteUser(-1);
            expect(response.status).to.equal(UserStatusCode.ERROR);
            expect(response.message).to.equal('User not found or error deleting user');
        });

        it('should return undefined if the user is not found after deleting', async () => {
            const response = await userService.getUserById(1);
            expect(response.status).to.equal(UserStatusCode.ERROR);
            expect(response.message).to.equal('User not found');
            expect(response.safeUser).to.equal(undefined);
        });
    });
});

describe('Safe User', () => {
    describe('toSafeUser', () => {
        it('should return a safe user object', () => {
            const user: User = {
                id: 1,
                username: 'testuser',
                password: 'testpassword'
            };

            const safeUser = toSafeUser(user);

            expect(safeUser).to.be.an('object');
            expect(safeUser?.id).to.equal(1);
            expect(safeUser?.username).to.equal('testuser');
            expect(safeUser?.password).to.equal(null);
        });

        it('should return undefined if no user is provided', () => {
            const user = null;

            const safeUser = toSafeUser(user);

            expect(safeUser).to.equal(undefined);
        });
    });
});