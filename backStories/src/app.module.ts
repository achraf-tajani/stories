import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StoriesController } from './stories.controller';

@Module({
  imports: [
    MulterModule.register({
      dest: './assets',
    }),
  ],
  controllers: [AppController, StoriesController],
  providers: [AppService],
})
export class AppModule {}
