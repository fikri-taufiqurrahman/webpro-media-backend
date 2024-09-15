import multer from 'multer';
import path from 'path';

// Setup penyimpanan multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Tentukan folder untuk menyimpan gambar
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname); // Ambil ekstensi file
        cb(null, `${file.fieldname}-${Date.now()}${ext}`); // Buat nama file yang unik
    }
});

// Filter file untuk memastikan hanya gambar yang bisa di-upload
const fileFilter = (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = fileTypes.test(file.mimetype);

    if (extname && mimeType) {
        return cb(null, true);
    } else {
        cb(new Error('Only images are allowed!'));
    }
};

// Middleware multer untuk menangani upload
export const upload = multer({
    storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // Batas ukuran file 2MB
    fileFilter,
});