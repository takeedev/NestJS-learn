import { registerAs } from '@nestjs/config';
import type { TypeOrmModuleOptions } from '@nestjs/typeorm';

const supportedEnvironments = ['local', 'sit', 'uat', 'prod'];

export const appEnvironment = process.env.APP_ENV ?? 'local';

if (!supportedEnvironments.includes(appEnvironment)) {
  throw new Error('APP_ENV must be local, sit, uat, or prod');
}

export const envFilePath =
  appEnvironment === 'local'
    ? ['.env.local', '.env']
    : `.env.${appEnvironment}`;

export const databaseConfig = registerAs(
  'database',
  (): TypeOrmModuleOptions => {
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
      type: 'postgres',
      host: PGHOST,
      port,
      username: PGUSER,
      password: PGPASSWORD,
      database: PGDATABASE,
      connectTimeoutMS: 5000,
      autoLoadEntities: true,
      synchronize: false,
    };
  },
);
