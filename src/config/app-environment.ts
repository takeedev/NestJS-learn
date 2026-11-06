const supportedEnvironments = ['local', 'sit', 'uat', 'prod'];

export const appEnvironment = process.env.APP_ENV ?? 'local';

if (!supportedEnvironments.includes(appEnvironment)) {
  throw new Error('APP_ENV must be local, sit, uat, or prod');
}

export const envFilePath =
  appEnvironment === 'local'
    ? ['.env.local', '.env']
    : `.env.${appEnvironment}`;
