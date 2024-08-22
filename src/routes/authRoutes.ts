import { Router } from 'express';
import * as authController from '../controllers/authController';

const router = Router();

// Auth routes
router.get(     '/auth/profile',    authController.getUserProfile   );
router.post(    '/auth/login',      authController.loginUser        );
router.post(    '/auth/logout',     authController.logoutUser       );
router.post(    '/auth/register',   authController.registerUser     );

export default router;