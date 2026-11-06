import {
  Global,
  Inject,
  Injectable,
  Logger,
  Module,
  type OnModuleDestroy,
} from '@nestjs/common';
import { ConfigModule, type ConfigType } from '@nestjs/config';
import { Pool } from 'pg';
import { databaseConfig } from '../config/database.config.js';

@Injectable()
export class DatabaseService implements OnModuleDestroy {
  readonly pool: Pool;

  constructor(
    @Inject(databaseConfig.KEY) config: ConfigType<typeof databaseConfig>,
  ) {
    const logger = new Logger(DatabaseService.name);
    this.pool = new Pool(config);
    this.pool.on('error', (error) => {
      logger.error('Idle PostgreSQL connection failed', error.stack);
    });
  }

  async onModuleDestroy(): Promise<void> {
    await this.pool.end();
  }
}

@Global()
@Module({
  imports: [ConfigModule.forFeature(databaseConfig)],
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
