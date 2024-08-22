import { Pool } from 'pg';
import * as config from './config';

export const pool = new Pool({
  user: config.POSTGRES_USER,
  host: config.POSTGRES_HOST,
  database: config.POSTGRES_DATABASE,
  password: config.POSTGRES_PASSWORD,
  port: config.POSTGRES_PORT,
});

export const connectDatabase = async () => {
  try {
    await pool.connect();
    console.log('Connected to the PostgreSQL database');
  } catch (err) {
    console.error('Failed to connect to the PostgreSQL database:', err);
  }
};