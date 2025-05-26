import * as dotenv from 'dotenv';
dotenv.config();

export const envs = {
    port: process.env.PORT || 8080,
    dbHost: process.env.DB_HOST || 'localhost',
    dbPort: parseInt(process.env.DB_PORT) || 5432,
    dbUsername: process.env.DB_USERNAME || 'postgres',
    dbPassword: process.env.DB_PASSWORD || '',
    dbName: process.env.DB_NAME || 'postgres',
    jwtSecret: process.env.JWT_SECRET || '',
}