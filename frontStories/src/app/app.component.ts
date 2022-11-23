import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import ImageEditor from 'tui-image-editor';

class ImageSnippet {
  constructor(public src: string, public file: File) {}
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements AfterViewInit {
  @ViewChild('videoPlayer', { static: false }) videoPlayer?: ElementRef;
  @ViewChild('conainerImage', { static: false }) conainerImage?: ElementRef;
  @ViewChild('imageSelected', { static: false }) imageSelected?: ElementRef;
  @ViewChild('fileInput', { static: false }) fileInput?: ElementRef;
  @ViewChild('filesInput', { static: false }) filesInput?: ElementRef;
  @ViewChild('conainerEditor', { static: false }) conainerEditor?: ElementRef;
  @ViewChildren('img') img?: ElementRef[];
  loader:boolean = false;
  cameraSrc:string = '';
  transition: { tr: boolean; id: number; name: string }[] = [];
  url = '/api/single';
  urll = '/api/multi';
  imageEditor: any;
  characters: { created: string; id: string; image: string; gender: string }[] =
    [];
  constructor(private http: HttpClient, private elementRef: ElementRef) {}

  ngAfterViewInit(): void {
    this.http
      .get('https://rickandmortyapi.com/api/character')
      .subscribe((res: any) => (this.characters = res.results.splice(0, 5)));
    this.imageEditor = new ImageEditor(this.conainerEditor?.nativeElement, {
      includeUI: {
        loadImage: {
          path: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
          name: 'Blank',
        },
        theme: {}, // or whiteTheme
        // initMenu: "filter",
        menuBarPosition: 'bottom',
      },
      cssMaxWidth: 700,
      cssMaxHeight: 500,
      usageStatistics: false,
    });
  }
   dataURLtoFile (dataurl:any, filename:any){
    const arr = dataurl.split(',')
    const mime = arr[0].match(/:(.*?);/)[1]
    const bstr = atob(arr[1])
    let n = bstr.length
    const u8arr = new Uint8Array(n)
    while (n) {
      u8arr[n-1] = bstr.charCodeAt(n-1)
      n -= 1 // to make eslint happy
    }
    return new File([u8arr], filename, { type: mime })
  }
  generate() {
    this.loader = true;
    let items: object[] = [];
    const data = new FormData()
    this.characters.forEach((elm) => {
      if(elm.image.includes('data:image/')){
        let file = this.dataURLtoFile(elm.image,'img'+elm.id+".jpeg");
        data.append('files', file, file.name)
      }else {
        items.push({path:elm.image})
      }
    });
    

    this.http
      .post('/storie/multi', data)
      .subscribe((res) => {
        this.loader = false;
        this.cameraSrc = "http://localhost:3000/storie/stream/"+res

      },(err)=>{
        this.loader = false;
        console.log(err)
      });
  }

  play(){
    if( this.videoPlayer){
      this.videoPlayer.nativeElement.setAttribute('src',this.cameraSrc);
      this.videoPlayer.nativeElement.play();

      
    }
  }
  updateImage(char: any) {
    if (this.imageSelected?.nativeElement) {
      this.imageSelected.nativeElement.value = char.id;
    }
    this.imageEditor
      .loadImageFromURL(char.image, char.id)
      .then((result: any) => {
        // console.log('old : ' + result.oldWidth + ', ' + result.oldHeight);
        // console.log('new : ' + result.newWidth + ', ' + result.newHeight);
      })
      .catch((message: any) => {
        console.log('error: ', message);
      });
  }

  save() {
    if (this.imageSelected) {
      if (
        this.imageSelected.nativeElement.value.length > 0 &&
        this.imageSelected.nativeElement.value != 'undefined'
      ) {
        const elementFromCharacter = this.characters.filter(
          (elm) => elm.id == this.imageSelected?.nativeElement.value
        )[0];
        elementFromCharacter.image =this.imageEditor.toDataURL({ 'format':'jpeg'});
        this.elementRef.nativeElement.querySelector('.tie-btn-reset').click();
        if (this.imageSelected?.nativeElement) {
          this.imageSelected.nativeElement.value = undefined;
        }
      }
    }
  }

  fileUpload() {
    const imageBlob = this.fileInput?.nativeElement.files[0];
    const file = new FormData();
    file.set('file', imageBlob);
    this.http.post(this.url, file).subscribe();
  }

  makingSomeStuf() {
    const this_ = this;
    const inputsFile = this.filesInput?.nativeElement.files;
    if (this.filesInput?.nativeElement.files.length > 0) {
      let ul = document.createElement('ul');
      for (let i = 0; i < inputsFile.length; i++) {
        let li = document.createElement('li');
        li.innerHTML = inputsFile[i].name + ' - ' + inputsFile[i].type;
        let check = document.createElement('input');
        check.setAttribute('type', 'checkbox');
        check.addEventListener('change', function (e) {
          if (this.checked) {
            this_.transition.push({
              tr: true,
              id: i,
              name: inputsFile[i].name,
            });
          } else {
          }
        });
        li.appendChild(check);
        ul.appendChild(li);
      }
      this.conainerImage?.nativeElement.appendChild(ul);
    }
  }
  filesUpload() {
    let files = new FormData();
    const inputsFile = this.filesInput?.nativeElement.files;
    if (inputsFile) {
      for (let i = 0; i < inputsFile.length; i++) {
        files.append('files', inputsFile[i]);
      }
      files.append('transitions', JSON.stringify(this.transition));
      console.log(this.transition);
      this.http.post(this.urll, files).subscribe();
    }
  }
}
