import multer from "multer";

import path from "path";

import { fileURLToPath } from "url";

// Obter o diretório atual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let folder = "";

    console.log(req.baseUrl);

    if (req.baseUrl.includes('products')) {
      folder = "product";
    }else if(req.baseUrl.includes('videos')) {
      folder = "video";
    }else if(req.baseUrl.includes('courses')) {
      folder = "course";
    }else {
      folder = "user";
    }
    cb(null, path.join(__dirname, `../public/${folder}/`));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  // Aceite apenas imagens
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png" || file.mimetype === "video/mp4") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

export default upload;




// import multer from 'multer';
// import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
// import path from 'path';
// import fs from 'fs/promises';
// import { fileURLToPath } from 'url';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // Configuração do S3 Client v3
// const s3Client = new S3Client({
//   region: process.env.AWS_REGION,
//   endpoint: process.env.AWS_ENDPOINT_URL,
//   forcePathStyle: true,
//   credentials: {
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   },
// });

// const determineS3KeyPrefix = (req) => {
//   if (req.baseUrl.includes('products')) {
//     return 'product/';
//   } else if (req.baseUrl.includes('videos')) {
//     return 'video/';
//   } else if (req.baseUrl.includes('courses')) {
//     return 'course/';
//   } else {
//     return 'user/';
//   }
// };

// // Configuração do Multer para armazenamento local (temporário)
// const storageLocal = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const folder = determineS3KeyPrefix(req).slice(0, -1);
//     const uploadPath = path.join(__dirname, `../public/${folder}/`);
//     fs.mkdir(uploadPath, { recursive: true })
//       .then(() => cb(null, uploadPath))
//       .catch(err => cb(err));
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname));
//   },
// });

// const fileFilter = (req, file, cb) => {
//   if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'video/mp4') {
//     cb(null, true);
//   } else {
//     cb(null, false);
//   }
// };

// const uploadLocal = multer({ storage: storageLocal, fileFilter: fileFilter });

// const uploadToS3v3 = async (req, file) => {
//   const prefix = determineS3KeyPrefix(req);
//   const key = prefix + file.filename;
//   const fileContent = await fs.readFile(file.path);

//   const uploadParams = {
//     Bucket: process.env.AWS_BUCKET_NAME || 'teste-up-clean',
//     Key: key,
//     Body: fileContent,
//     ContentType: file.mimetype,
//   };

//   try {
//     const data = await s3Client.send(new PutObjectCommand(uploadParams));
//     // Construct the URL for LocalStack
//     return `http://localhost:4566/${uploadParams.Bucket}/${uploadParams.Key}`;
//   } catch (error) {
//     console.error('Error uploading to S3:', error);
//     throw error;
//   } finally {
//     // Clean up the temporary file
//     await fs.unlink(file.path).catch(err => console.error('Error deleting temporary file:', err));
//   }
// };

// const createUploadMiddlewareV3 = (fieldName) => async (req, res, next) => {
//   const upload = uploadLocal.single(fieldName);

//   upload(req, res, async (err) => {
//     if (err) {
//       return next(err);
//     }
//     if (req.file) {
//       try {
//         req.file.location = await uploadToS3v3(req, req.file);
//       } catch (error) {
//         return next(error);
//       }
//     }
//     next();
//   });
// };

// export default createUploadMiddlewareV3;