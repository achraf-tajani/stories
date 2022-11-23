import { Body, Controller, Post } from '@nestjs/common';
var videoshow = require('videoshow');
import { VideoShow } from './classes/videoShow.class';
import { v4 as uuidv4 } from 'uuid';

@Controller('storie')
export class StoriesController {
  constructor() {}

  @Post('generatingVideo')
  async makingVideo(@Body() infos: any): Promise<boolean> {
    return new Promise((resolve, reject) => {
      let video = new VideoShow('640x360', infos.infos);
      let images = [];
      video.items.forEach((elm: any) => {
        images.push({
          path: elm.path,
          loop: 5,
          caption: 'test',
          disableFadeOut: true,
          filters:
            "zoompan=z='if(lte(zoom,1.0),1.5,max(1.001,zoom-0.0015))':d=125",
        });
      });
      videoshow(images, video.options)
        .save(process.cwd() + '/assets/videos/video-' + uuidv4() + '.mp4')
        .on('start', function (command) {
          console.log('start make');
        })
        .on('error', function (err, stdout, stderr) {
          console.log(err);
          console.log(stdout);
          console.log(stderr);
          reject(false);
        })
        .on('end', function (output) {
          resolve(true);
        });
    });
  }
}
