import jwt from 'jsonwebtoken';

// Middleware untuk memverifikasi token JWT
export const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization') ? req.header('Authorization').replace('Bearer ', '') : '';

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Simpan data user dari token ke req.user
        next(); // Lanjutkan ke handler berikutnya
    } catch (err) {
        res.status(401).json({ message: 'Invalid token' });
    }
};