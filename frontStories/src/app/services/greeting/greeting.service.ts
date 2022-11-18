import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GreetingService {

  constructor(private http:HttpClient) { }

  hello() {
    return this.http.get("api/getHello");
  }

  make(ar:any[]) {
    return this.http.post("api/makeVideo",{montage:ar});
  }
}
