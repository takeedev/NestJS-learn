import { registerAs } from '@nestjs/config';
import type { PoolConfig } from 'pg';
import { appEnvironment } from './app-environment.js';

export const databaseConfig = registerAs('database', (): PoolConfig => {
  const isLocal = appEnvironment === 'local';
  const {
    PGHOST = isLocal ? '127.0.0.1' : undefined,
    PGUSER = isLocal ? 'todo' : undefined,
    PGPASSWORD = isLocal ? 'todo_local' : undefined,
    PGDATABASE = isLocal ? 'todos' : undefined,
    PGPORT = '5432',
  } = process.env;

  if (
    !isLocal &&
    (!PGHOST?.trim() ||
      !PGUSER?.trim() ||
      !PGPASSWORD?.trim() ||
      !PGDATABASE?.trim())
  ) {
    throw new Error(
      `APP_ENV=${appEnvironment} requires PGHOST, PGUSER, PGPASSWORD, and PGDATABASE`,
    );
  }

  const port = Number(PGPORT);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error('PGPORT must be an integer between 1 and 65535');
  }

  return {
    host: PGHOST,
    port,
    user: PGUSER,
    password: PGPASSWORD,
    database: PGDATABASE,
    connectionTimeoutMillis: 5000,
  };
});
