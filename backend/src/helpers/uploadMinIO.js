import multer from 'multer';
import * as Minio from 'minio'
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuração do Minio Client
const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_ENDPOINT_URL || 'minio',
  port: parseInt(process.env.MINIO_PORT) || 9000,	
  useSSL: false,
  accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
  secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin',
}); 

const determineS3KeyPrefix = (req) => {
  if (req.baseUrl.includes('products')) {
    return 'product/';
  } else if (req.baseUrl.includes('videos')) {
    return 'video/';
  } else if (req.baseUrl.includes('courses')) {
    return 'course/';
  } else {
    return 'user/';
  }
};

// Configuração do Multer para armazenamento local (temporário)
const storageLocal = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = determineS3KeyPrefix(req).slice(0, -1);
    const uploadPath = path.join(__dirname, `../public/${folder}/`);
    fs.mkdir(uploadPath, { recursive: true })
      .then(() => cb(null, uploadPath))
      .catch(err => cb(err));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'video/mp4') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const uploadLocal = multer({ storage: storageLocal, fileFilter: fileFilter });

const uploadToMinio = async (req, file) => {
  const prefix = determineS3KeyPrefix(req);
  const key = prefix + file.filename;
  const fileContent = await fs.readFile(file.path);
  const bucketName = process.env.MINIO_BUCKET_NAME || 'teste-up-clean';

  try {
    await minioClient.putObject(bucketName, key, fileContent, {
      'Content-Type': file.mimetype,
    });
    // Construct the URL for MinIO
    const region = process.env.MINIO_REGION || '';
    return minioClient.presignedGetObject(bucketName, key, 7 * 24 * 60 * 60); // URL presigned válida por 7 dias
  } catch (error) {
    console.error('Error uploading to Minio:', error);
    throw error;
  } finally {
    // Clean up the temporary file
    await fs.unlink(file.path).catch(err => console.error('Error deleting temporary file:', err));
  }
};

const createUploadMiddlewareV3 = (fieldName) => async (req, res, next) => {
  const upload = uploadLocal.single(fieldName);

  upload(req, res, async (err) => {
    if (err) {
      return next(err);
    }
    if (req.file) {
      try {
        req.file.location = await uploadToMinio(req, req.file);
      } catch (error) {
        return next(error);
      }
    }
    next();
  });
};

export default createUploadMiddlewareV3;