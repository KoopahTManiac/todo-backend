import { config } from 'dotenv';
import { EnvString, EnvNumber, validateEnvNumber, validateEnvString } from '../helper/config';

config();

/** Server config */
export const PORT: number = EnvNumber('PORT', 3000);
export const HOST: string = EnvString('HOST', '0.0.0.0');

export const FRONTEND_HOST: string = EnvString('FRONTEND_HOST', 'localhost');
export const FRONTEND_PORT: number = EnvNumber('FRONTEND_PORT', 3001);

/** API config */
export const API: string = EnvString('API', '/api/v1');

/** Postgres config */
export const POSTGRES_USER: string = validateEnvString('POSTGRES_USER');
export const POSTGRES_PASSWORD: string = validateEnvString('POSTGRES_PASSWORD');
export const POSTGRES_HOST: string = validateEnvString('POSTGRES_HOST');
export const POSTGRES_PORT: number = validateEnvNumber('POSTGRES_PORT');
export const POSTGRES_DATABASE: string = validateEnvString('POSTGRES_DATABASE');

/** Validate JWT config */
export const JWT_SECRET: string = validateEnvString('JWT_SECRET');
export const JWT_EXPIRATION: number = validateEnvNumber('JWT_EXPIRATION');

console.log('Configuration loaded successfully');