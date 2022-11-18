import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
class ImageSnippet {
  constructor(public src: string, public file: File) {}
}
@Component({
  selector: 'app-root',
  template: `
        <div>
        single <input type="file" #fileInput>   <button (click)="fileUpload()">send</button><br><br>
        multiple <input type="file" (change)="makingSomeStuf()" #filesInput multiple>  <button (click)="filesUpload()">send</button><br><br>
        </div>
        <div #conainerImage>

        </div>

            `,
  styles: []
})
export class AppComponent {
  @ViewChild('conainerImage', {static:false}) conainerImage?:ElementRef;
  @ViewChild('fileInput', {static:false}) fileInput?:ElementRef;
  @ViewChild('filesInput', {static:false}) filesInput?:ElementRef;
  transition:{tr:boolean,id:number,name:string}[] = [];
  url = '/api/single';
  urll = '/api/multi';

  constructor(private http:HttpClient){}
  fileUpload() {
    const imageBlob = this.fileInput?.nativeElement.files[0];
    const file = new FormData();
    file.set('file',imageBlob);
    this.http.post(this.url,file).subscribe();
  }
  makingSomeStuf() {
    const this_=this;
    const inputsFile =  this.filesInput?.nativeElement.files;
    if(this.filesInput?.nativeElement.files.length>0) {
      let ul = document.createElement('ul');
      for(let i=0;i<inputsFile.length;i++){
        let li = document.createElement('li');
        li.innerHTML = inputsFile[i].name + ' - ' + inputsFile[i].type;
        let check = document.createElement('input');
        check.setAttribute("type", "checkbox");
        check.addEventListener('change', function(e) {
          if (this.checked) { 
            this_.transition.push({tr:true,id:i,name:inputsFile[i].name})
          } else {
          }
        });
        li.appendChild(check)
        ul.appendChild(li);
      }
      this.conainerImage?.nativeElement.appendChild(ul)
    }
  }
  filesUpload() {
    let files = new FormData();
    const inputsFile =  this.filesInput?.nativeElement.files;
    if(inputsFile){
      for(let i=0;i<inputsFile.length;i++){
        files.append('files',inputsFile[i])
      }
      files.append('transitions',JSON.stringify(this.transition))
      console.log(this.transition)
      this.http.post(this.urll,files).subscribe();
    }
 
  }
}
