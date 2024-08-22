import express, { Application } from 'express';
import todoRoutes from './routes/todoRoutes';

const app: Application = express();

app.use(express.json());
app.use('/api/todos', todoRoutes);

const PORT: number = Number(process.env.PORT) || 3000;
const HOST: string = process.env.HOST || "0.0.0.0";

app.listen(PORT, HOST, () => {
  console.log(`Server is running at ${HOST}:${PORT}`);
});