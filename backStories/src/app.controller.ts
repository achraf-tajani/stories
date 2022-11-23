import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Res,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, parse } from 'path';

import { AppService } from './app.service';
var videoshow = require('videoshow');
const project_dir = process.cwd();
const EXT = ['JPEG', 'PNG', 'JPG'];
import { v4 as uuidv4 } from 'uuid';
const videoOptions = {
  fps: 25,
  transition: true,
  transitionDuration: 0.5, // seconds
  videoBitrate: 1024,
  videoCodec: 'libx264',
  size: '1920x1080',
  audioBitrate: '128k',
  audioChannels: 2,
  format: 'mp4',
  pixelFormat: 'yuv420p',
};

const editFileName = (req, file, callback) => {
  const name = file.originalname.split('.')[0];
  const fileExtName = extname(file.originalname);
  const randomName = Array(4)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join('');
  callback(null, `${name}-${randomName}${fileExtName}`);
};

const imageFileFilter = (req, file, callback) => {
  if (
    !parse(file.originalname)
      .ext.toLowerCase()
      .match(/\.(jpg|jpeg|png)$/)
  ) {
    return callback(
      new Error(
        'Only image files are allowed! [' +
          parse(file.originalname).ext +
          '] (x)',
      ),
      false,
    );
  }
  callback(null, true);
};

@Controller('api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('getHello')
  getHello(): object {
    return this.appService.getHello();
  }

  createVideo(montage, nameOutput): Promise<string> {
    return new Promise((resolve, reject) => {
      videoshow(montage, videoOptions)
        .audio(project_dir + '/assets/audio/audio.mp3')
        .save(nameOutput)
        .on('start', function (command) {
          console.log('start make');
        })
        .on('error', function (err, stdout, stderr) {
          console.log(err);
          console.log(stdout);
          console.log(stderr);
          reject('error');
        })
        .on('end', function (output) {
          resolve('ok');
        });
    });
  }

  @Post('single')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './assets/images',
        filename: (req, file, cb) => {
          console.log(file);
          const filename = parse(file.originalname).name + uuidv4();
          const ext = parse(file.originalname).ext;
          cb(null, `${filename}${ext}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (file.originalname.match(/\.(jpg|jpeg|png)$/)) {
          return cb(null, false);
        }
        return cb(null, true);
      },
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
  }

  @Post('multi')
  @UseInterceptors(
    FilesInterceptor('files', 20, {
      storage: diskStorage({
        destination: './assets/images',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async uploadMultipleFiles(@UploadedFiles() files, @Body() infos: any) {
    const images = [];
    const transition = JSON.parse(infos.transitions);
    console.log(transition);
    files.forEach((file) => {
      let tr = false;
      console.log(file.originalname);
      if (
        transition.filter((elm) => elm.name == file.originalname).length > 0
      ) {
        tr = true;
      }
      images.push({
        path: file.path,
        loop: 5,
        caption: 'Hello world as video subtitle 1',
        disableFadeOut: true,
        filters:
          "zoompan=z='if(lte(zoom,1.0),1.5,max(1.001,zoom-0.0015))':d=125",
      });
    });

    console.log(images);
    await this.createVideo(
      images,
      project_dir + '/assets/videos/test1.mp4',
    ).then((elm) => {});
  }

  @Get(':imgpath')
  seeUploadedFile(@Param('imgpath') image, @Res() res) {
    return res.sendFile(image, { root: './assets/images' });
  }
}
