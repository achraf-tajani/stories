
document.addEventListener("DOMContentLoaded", async function() {
  let imageUnit8 = [];
  const generateBtn = document.getElementById("generateBtn");
  const video = document.getElementById("player");
   

  const ffmpeg = FFmpeg.createFFmpeg({
    corePath: new URL('js/ffmpeg-core.js', document.location).href,
    workerPath: new URL('js/ffmpeg-core.worker.js', document.location).href,
    wasmPath: new URL('js/ffmpeg-core.wasm', document.location).href,
    log: true
  });
  await ffmpeg.load();


  // inputs
  for(let i=1;i<3;i++) {
      let imgPath = `https://rickandmortyapi.com/api/character/avatar/${i}.jpeg`;
      let file = await dataURLtoFile(imgPath,'img'+i);
      imageUnit8.push({unit8:new Uint8Array(await readFileAsArrayBuffer(file)),file:file}
      );
  } 
    
    generateBtn.addEventListener("click", async (evt) => {
        imageUnit8.forEach((elm,index) => {
          console.log( elm)
            ffmpeg.FS("writeFile", elm.file.name, elm.unit8);
        });
        try {
          await ffmpeg.run(
            '-framerate' ,'1',
            '-start_number','1',
            '-i', 'img%d.jpeg',
            '-filter_complex',
            '[0][1]xfade=duration=1:offset=1:transition=fadeblack',
	          // '-vf',
            // "zoompan=z='zoom+0.001':s=300x300",
	          '-pix_fmt',
	          'yuv420p',
	          '-c:v',
	          'libx264',
            'out.mp4');	
        }catch(err) {
            console.log(err)
        }

        
        const data = ffmpeg.FS("readFile", "out.mp4");
        video.src = URL.createObjectURL(
            new Blob([data.buffer], { type: "video/mp4" })
        );
        ffmpeg.FS("unlink", 'out.mp4');
    });
    
    function readFileAsArrayBuffer(file) {
      return new Promise((resolve, reject) => {
        let fileredr = new FileReader();
        fileredr.onload = () => resolve(fileredr.result);
        fileredr.onerror = () => reject(fileredr);
        fileredr.readAsArrayBuffer(file);
      });
    }
    
    // Converts Uint8Array to Base64
    function convertBitArrtoB64(bitArr) {
      return btoa(
        bitArr.reduce((data, byte) => data + String.fromCharCode(byte), "")
      );
    }
    async function dataURLtoFile(imgPath,name){
        const type = get_url_extension(imgPath);
        let response = await fetch(imgPath);
        let data = await response.blob();
        let metadata = {
          type: 'image/'+ type
        };
        return new File([data], name +'.'+ type, metadata);
    }

    function get_url_extension( url ) {
        return url.split(/[#?]/)[0].split('.').pop().trim();
    }
});


