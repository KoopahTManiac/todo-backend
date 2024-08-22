import { Router } from 'express';
import * as taskController from '../controllers/taskController';

const router = Router();

// Task routes
router.post(    '/task',          taskController.createTask       );
router.get(     '/task',          taskController.getTasks         );
router.get(     '/task/:id',      taskController.getTaskById      );
router.put(     '/task/:id',      taskController.updateTask       );
router.delete(  '/task/:id',      taskController.deleteTask       );
router.put(     '/task/:id/done', taskController.markTaskAsDone   );
router.get(     '/task/filter',   taskController.filterTasks      );
router.put(     '/task/order',    taskController.reorderTasks     );

export default router;