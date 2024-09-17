import jwt from 'jsonwebtoken';

const socketSetup = (io) => {
    io.on('connection', (socket) => {
        console.log('A user connected');

        // Token JWT diambil dari query atau header saat koneksi
        const token = socket.handshake.query.token || socket.handshake.headers['authorization'];
        
        if (token && token.startsWith("Bearer ")) {
            const jwtToken = token.split(" ")[1];  // Pisahkan Bearer dari token
            jwt.verify(jwtToken, process.env.JWT_SECRET, (err, decoded) => {
                if (err) {
                    console.log('Token verification failed:', err);
                    return socket.disconnect();  // Jika token tidak valid, putuskan koneksi
                }

                const userId = decoded.id;  // Ambil userId dari token

                // Masukkan pengguna ke room berdasarkan userId
                socket.join(userId);
                console.log(`User ${userId} joined room ${userId}`);

                // Hapus pengguna dari room saat mereka disconnect
                socket.on('disconnect', () => {
                    console.log(`User ${userId} disconnected`);
                });
            });
        } else {
            console.log('No token provided. Disconnecting user.');
            socket.disconnect();  // Putuskan koneksi jika tidak ada token
        }
    });
};

export default socketSetup;
