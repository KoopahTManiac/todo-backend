import { pool } from '../config/database';

interface Todo {
    id: number;
    title: string;
    description: string;
    isCompleted: boolean;
}

