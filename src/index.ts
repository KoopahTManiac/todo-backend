import express, { Application } from 'express';
import expressWs from 'express-ws';
import cors from 'cors';

// Routes
import authRoutes from './routes/authRoutes';
import taskRoutes from './routes/taskRoutes';

// Config
import * as config from './config/config';
import { SafeUser } from './models/User';
import { authenticateUser } from './middleware/authMiddleware';


declare global {
    namespace Express {
        interface Request {
            user?: SafeUser;
        }
    }
}

const setup = async () => {
    const app: Application = express();

    expressWs(app);
    app.use(express.json());
    app.use(cors());
    app.use(authenticateUser);

    app.use(config.API, (await import('./routes/todoRoutes')).default); // Dynamic import to use ws router
    app.use(config.API, authRoutes);
    app.use(config.API, taskRoutes);

    app.listen(config.PORT, config.HOST, () => {
        console.log(`Server is running at ${config.HOST}:${config.PORT}`);
    });
};

setup();



