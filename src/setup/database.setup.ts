import path from 'path';
import fs from 'fs';
import { connectDatabase, pool } from '../config/database';

const formatLog = (message: string) => {
  const padding = ' '.repeat(4);
  console.log(`${padding}\x1b[32m- ${message}\x1b[0m`);
}

// Function to create the users table and its index
const createUsersTable = async () => {
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        password VARCHAR(60) NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
    );
  `;
  const createIndexSQL = `CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);`;

  try {
    await pool.query(createTableSQL);
    await pool.query(createIndexSQL);
    formatLog('Users table created successfully.');
  } catch (error: any) {
    console.error('Error creating Users table:', error.message);
  }
}

// Function to create the todo_lists table and its indexes
const createTodoListsTable = async () => {
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS todo_lists (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        user_id INTEGER NOT NULL,
        is_locked BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        CONSTRAINT fk_user_todo_lists FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `;
  const createUserIdIndexSQL = `CREATE INDEX IF NOT EXISTS idx_todo_lists_user_id ON todo_lists(user_id);`;

  try {
    await pool.query(createTableSQL);
    await pool.query(createUserIdIndexSQL);
    formatLog('Todo Lists table created successfully.');
  } catch (error: any) {
    console.error('Error creating Todo Lists table:', error.message);
  }
}

// Function to create the tasks table and its indexes
const createTasksTable = async () => {
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS tasks (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        todo_list_id INTEGER NOT NULL,
        task_id INTEGER NULL,
        is_completed BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        CONSTRAINT fk_todo_list FOREIGN KEY (todo_list_id) REFERENCES todo_lists(id) ON DELETE CASCADE,
        CONSTRAINT fk_parent_task FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
    );
  `;
  const createTodoListIdIndexSQL = `CREATE INDEX IF NOT EXISTS idx_tasks_todo_list_id ON tasks(todo_list_id);`;
  const createParentTaskIdIndexSQL = `CREATE INDEX IF NOT EXISTS idx_tasks_parent_task_id ON tasks(task_id);`;
  const createIsCompletedIndexSQL = `CREATE INDEX IF NOT EXISTS idx_tasks_is_completed ON tasks(is_completed);`;

  try {
    await pool.query(createTableSQL);
    await pool.query(createTodoListIdIndexSQL);
    await pool.query(createParentTaskIdIndexSQL);
    await pool.query(createIsCompletedIndexSQL);
    formatLog('Tasks table created successfully.');
  } catch (error: any) {
    console.error('Error creating Tasks table:', error.message);
  }
}

// Function to create the auth_keys table and its indexes
const createAuthKeysTable = async () => {
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS auth_keys (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        key VARCHAR(64) NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT NOW(),
        expired_at TIMESTAMP DEFAULT NOW() + INTERVAL '1 YEAR',
        CONSTRAINT check_expiration CHECK (expired_at > created_at),
        CONSTRAINT fk_user_auth_keys FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `;
  const createUserIdIndexSQL = `CREATE INDEX IF NOT EXISTS idx_auth_keys_user_id ON auth_keys(user_id);`;
  const createKeyIndexSQL = `CREATE INDEX IF NOT EXISTS idx_auth_keys_key ON auth_keys(key);`;

  try {
    await pool.query(createTableSQL);
    await pool.query(createUserIdIndexSQL);
    await pool.query(createKeyIndexSQL);
    formatLog('Auth Keys table created successfully.');
  } catch (error: any) {
    console.error('Error creating Auth Keys table:', error.message);
  }
}

// Main function to run all setup functions
export const runSetup = async () => {
  try {
    await createUsersTable();
    await createTodoListsTable();
    await createTasksTable();
    await createAuthKeysTable();
    formatLog('Database setup completed successfully.');
  } catch (error: any) {
    console.error('Error setting up the database:', error.message);
  }
};


export const dropTables = async () => {
  try {
    await pool.query(`DROP TABLE IF EXISTS users, todo_lists, tasks, auth_keys;`);
    await pool.query(`DROP INDEX IF EXISTS idx_users_username, idx_todo_lists_user_id, idx_tasks_todo_list_id, idx_tasks_parent_task_id, idx_tasks_is_completed, idx_auth_keys_user_id, idx_auth_keys_key;`);
    formatLog('Tables dropped successfully.');
  } catch (error: any) {
    console.error('Error dropping tables and indexes:', error.message);
  }
};

export const createTables = async () => {
  try {
    await createUsersTable();
    await createTodoListsTable();
    await createTasksTable();
    await createAuthKeysTable();
    formatLog('Tables created successfully.');
  } catch (error: any) {
    console.error('Error creating tables:', error.message);
  }
}