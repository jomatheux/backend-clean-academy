import multer from "multer";

import path from "path";

import { fileURLToPath } from "url";

// Obter o diretório atual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let folder = "";

    console.log(req)

    if (req.baseUrl.includes('products')) {
      folder = "products";
    }
    cb(null, path.join(__dirname, `../storage/${folder}/`));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  // Aceite apenas imagens
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
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