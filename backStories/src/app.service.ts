import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): object {
    let obj = {name:'zi H',age:10}
    return obj;
  }
}
