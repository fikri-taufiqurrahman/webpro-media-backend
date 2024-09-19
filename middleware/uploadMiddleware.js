import multer from "multer";
import multerS3 from "multer-s3";
import { S3Client } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import path from "path";

// Setup s3 client
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Setup storage s3
const storage = multerS3({
  s3,
  bucket: process.env.AWS_S3_BUCKET_NAME,
  metadata: function (req, file, cb) {
    cb(null, { fieldName: file.fieldname });
  },
  key: function (req, file, cb) {
    const uniqueName = `${file.fieldname}/${uuidv4()}-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
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

export const uploadStory = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: photoVideoFilter,
});
