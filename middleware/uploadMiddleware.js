import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";

// Setup penyimpanan multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `uploads/${file.fieldname}/`);
  },
  filename: (req, file, cb) => {
    // Menghasilkan UUID untuk memastikan nama file unik
    const uniqueName = `${uuidv4()}-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName); // Simpan nama file yang unik
  },
});

// Filter untuk foto
const photoFilter = (req, file, cb) => {
  const fileTypes = /jpeg|jpg|png/;
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = fileTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error("Only images are allowed!"));
  }
};

// Filter untuk video
const videoFilter = (req, file, cb) => {
  const fileTypes = /mp4|avi|mkv/;
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = fileTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error("Only videos are allowed!"));
  }
};

// Filter untuk video
const photoVideoFilter = (req, file, cb) => {
  const fileTypes = /mp4|avi|mkv|jpeg|jpg|png/;
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = fileTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error("File selected are not allowed!"));
  }
};

export const uploadPhoto = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: photoFilter,
});

export const uploadVideo = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: videoFilter,
});

export const uploadPost = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: photoVideoFilter,
});
