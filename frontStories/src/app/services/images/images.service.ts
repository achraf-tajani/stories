import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImagesService {

  constructor(private http:HttpClient) { }

  public uploadImage(image: File) {
    const formData = new FormData();
    formData.append('image', image);
    // return this.http.post('/api/v1/image-upload', formData);
  }

  public upload(images:any) {
    return  this.http.post('/api/multiple',{files:images.fileSource});
  }
}
