import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import multer from 'multer';
import { v4 as uuidv4} from 'uuid';
import { parse } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [MulterModule.register({
    dest: './assets',
  })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
