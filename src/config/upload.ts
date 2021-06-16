import path from 'path'; // módulo para ter o campinho da pasta independente do sistema operacional utilizando o __dirname
import multer from 'multer';
import crypto from 'crypto'; // módulo do node qwue serve para criar Hash's e criptografica

const tempFolder = path.resolve(__dirname, '..', '..', 'tmp');

export default {
  directory: tempFolder,
  storage: multer.diskStorage({
    destination: tempFolder,
    filename(request, file, callback) {
      const fileHash = crypto.randomBytes(10).toString('hex');
      const fileName = `${fileHash}-${file.originalname}`;

      return callback(null, fileName);
    },
  }),
};
