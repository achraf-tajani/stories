import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ApiImageModel,PhotosModel } from 'src/app/models/api.model';

@Component({
  selector: 'app-storie-simple',
  templateUrl: './storie-simple.component.html',
  styleUrls: ['./storie-simple.component.scss']
})
export class StorieSimpleComponent implements OnInit {
  images:PhotosModel[] = []
  constructor(private http:HttpClient) { }

  ngOnInit(): void {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        Authorization: '563492ad6f917000010000011b7eb221a8e242ab98c2e65fba0955bb'
      })
    };
    // this.http
    //   .get('https://rickandmortyapi.com/api/character')
    //   .subscribe((res: any) => (this.characters = res.results));
    this.http.get<ApiImageModel>('https://api.pexels.com/v1/search?query=nature',httpOptions).subscribe((res)=>{this.images = res.photos})
  }

}
