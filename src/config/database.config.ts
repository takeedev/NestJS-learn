import type { PoolConfig } from 'pg';

export function getDatabaseConfig(): PoolConfig {
  return {
    host: process.env.PGHOST ?? '127.0.0.1',
    port: Number(process.env.PGPORT ?? 5432),
    user: process.env.PGUSER ?? 'todo',
    password: process.env.PGPASSWORD ?? 'todo_local',
    database: process.env.PGDATABASE ?? 'todos',
    connectionTimeoutMillis: 5000,
  };
}
