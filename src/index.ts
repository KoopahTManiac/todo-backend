import express, { Application } from 'express';
import expressWs from 'express-ws';

// Routes
import todoRoutes from './routes/todoRoutes';
import authRoutes from './routes/authRoutes';
import taskRoutes from './routes/taskRoutes';

// Config
import * as config from './config/config';

const app: Application = express();

expressWs(app);
app.use(express.json());

app.use(config.API, todoRoutes);
app.use(config.API, authRoutes);
app.use(config.API, taskRoutes);

app.listen(config.PORT, config.HOST, () => {
    console.log(`Server is running at ${config.HOST}:${config.PORT}`);
});