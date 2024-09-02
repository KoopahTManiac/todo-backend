import { Router } from 'express';
import * as todoController from '../controllers/todoListController';

const router = Router();

// { title: string }
router.post(    '/todo',          todoController.createTodoList         );
router.get(     '/todo',          todoController.getTodoLists           );
router.get(     '/todo/:id',      todoController.getTodoListById        );
router.put(     '/todo/:id',      todoController.updateTodoList         );
router.delete(  '/todo/:id',      todoController.deleteTodoList         );
router.get(     '/todo/:id/url',  todoController.generateTodoListURL    );
router.ws(      '/todo/:id',      todoController.wsTodoList             );

export default router;