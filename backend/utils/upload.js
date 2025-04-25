// backend/utils/upload.js
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "..", "public", "uploads"));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const unique = `${file.fieldname}-${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${ext}`;
    cb(null, unique);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|gif|webp/;
  const ext = path.extname(file.originalname).toLowerCase();
  allowed.test(ext) ? cb(null, true) : cb(new Error("Only images are allowed"));
};

const upload = multer({ storage, fileFilter });

export default upload;
