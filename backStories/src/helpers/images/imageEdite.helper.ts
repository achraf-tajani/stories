import { extname, parse } from 'path';

export const editFileName = (req, file, callback) => {
    const name = file.originalname.split('.')[0];
    const fileExtName = extname(file.originalname);
    const randomName = Array(4)
      .fill(null)
      .map(() => Math.round(Math.random() * 16).toString(16))
      .join('');
    callback(null, `${name}-${randomName}${fileExtName}`);
  };
  
  export const imageFileFilter = (req, file, callback) => {
    console.log(file)
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