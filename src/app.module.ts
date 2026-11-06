import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { envFilePath } from './config/app-environment.js';
import { TodosModule } from './todos/todos.module.js';

@Module({
  imports: [ConfigModule.forRoot({ envFilePath }), TodosModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
