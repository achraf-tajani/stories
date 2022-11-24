import { Body, Controller, Get, Header, Headers, HttpStatus, Param, Post, Res, UploadedFiles, UseInterceptors } from '@nestjs/common';
var videoshow = require('videoshow');
const fsExtra = require('fs-extra');
import { VideoShow } from './classes/videoShow.class';
import { v4 as uuidv4 } from 'uuid';
import {  FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { editFileName, imageFileFilter } from './helpers/images/imageEdite.helper';
import { Response } from 'express';
import { createReadStream, statSync } from 'fs';

@Controller('storie')
export class StoriesController {
  constructor() {}

  makingVideo(infos): Promise<string> {
    const _this = this;
    return new Promise((resolve, reject) => {
      let videoname = 'video-' + uuidv4();
      let video = new VideoShow('640x480', infos);
      let images = [];
      video.items.forEach((elm: any) => {
        images.push({
          path: elm.path,
          loop: 5,
          disableFadeOut : true,disableFadeIn :true,
          // filters:"zoompan=z='zoom+0.001':x=0:y=0:d=120",
          // filters:"[0]scale=640:-2,setsar=1:1[out];[out]crop=640:480[out];[out]scale=8000:-1,zoompan=z='zoom+0.001':x=iw/2-(iw/zoom/2):y=ih/2-(ih/zoom/2):d=250"
        });
      });
      console.log(images.length+ " image to video start ")
      if(images.length>0) {
        videoshow(images, video.options)
          .save(process.cwd() + '/assets/videos/'+ videoname+'.mp4')
          .on('start', function (command) {
            console.log(command)
            console.log('start make');
          })
          .on('error', function (err, stdout, stderr) {
            console.log(err);
            console.log(stdout);
            console.log(stderr);
            reject(err);
          })
          .on('end', function (output) {
            console.log('____')
            _this.clearImagesDir();
            console.log('finish empty')
            resolve(JSON.stringify(videoname));
          });
      }else {
        reject(JSON.stringify('empty images'))
      }
    });
  }
  async clearImagesDir() {
    console.log('start clean')
    await fsExtra.emptyDirSync(process.cwd() + '/assets/images');
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
  async uploadMultipleFiles(@UploadedFiles() files) {
    return new Promise((resolve,reject)=>{
      this.makingVideo(files).then(res=>{resolve(res)}).catch(err=>{reject(err)})
    })
  }



  @Get('stream/:name')
  @Header('Accept-Ranges', 'bytes')
  @Header('Content-Type', 'video/mp4')
  async getStreamVideo(@Param('name') name: string, @Headers() headers, @Res() res: Response) {

    const videoPath = `assets/videos/${name}.mp4`;
    const { size } = statSync(videoPath);
    const videoRange = headers.range;
    if (videoRange) {
      const parts = videoRange.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : size - 1;
      const chunksize = (end - start) + 1;
      const readStreamfile = createReadStream(videoPath, { start, end, highWaterMark:60 });
      const head = {
        'Content-Range': `bytes ${start}-${end}/${size}`,
        'Content-Length': chunksize,
      };
      res.writeHead(HttpStatus.PARTIAL_CONTENT, head); //206
      readStreamfile.pipe(res);
    } else {
      const head = {
        'Content-Length': size,
      };
      res.writeHead(HttpStatus.OK, head);//200
      createReadStream(videoPath).pipe(res);
    }
  }


  @Get('video/:name')
  seeUploadedVideo(@Param('name') name, @Res() res) {
    let pathFile = '';
    if(name.includes('.mp4')) {
       pathFile  = process.cwd() + '/assets/videos/'+name;
    }else {
      pathFile  = process.cwd() + '/assets/videos/'+name+'.mp4';
    }
    try{
      return res.download(pathFile)
    }catch(err){
      throw err; 
    }
  }

  @Get('rvideo/:name')
  removeVideo(@Param('name') name, @Res() res) {
    let pathFile = '';
    if(name.includes('.mp4')) {
       pathFile  = process.cwd() + '/assets/videos/'+name;
    }else {
      pathFile  = process.cwd() + '/assets/videos/'+name+'.mp4';
    }
    try{
      return res.download(pathFile)
    }catch(err){
      throw err; 
    }
  }
}
