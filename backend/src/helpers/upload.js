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
    }else if(req.originalUrl.includes('courses/addvideo') || req.originalUrl.includes('courses/update/video')) {
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