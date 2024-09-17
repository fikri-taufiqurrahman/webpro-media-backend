import { Message, User } from "../models/index.js";

export const sendMessage = async (req, res) => {
    const { receiverId, messageText } = req.body;
    const {id : senderId} = req.user;  // Mengambil senderId dari req.user yang sudah diverifikasi oleh authMiddleware
    console.log(senderId)
    const io = req.io;  
    try {
      const newMessage = await Message.create({
        senderId,
        receiverId,
        messageText,
      });
     
      io.to(receiverId).emit('chat message', {
        senderId,
        messageText,
        createdAt: newMessage.createdAt,  
    });
      res.status(201).json(newMessage);  
    } catch (error) {
      res.status(500).json({ message: 'Gagal mengirim pesan', error });
    }
};

// Mendapatkan semua pesan antara dua pengguna
export const getMessages = async (req, res) => {
  const { senderId, receiverId } = req.params;

  try {
    // Validasi input
    if (!senderId || !receiverId) {
      return res.status(400).json({ message: "Sender ID dan Receiver ID harus disediakan." });
    }

    // Ambil semua pesan antara dua pengguna
    const messages = await Message.findAll({
      where: {
        [Op.or]: [
          { senderId, receiverId },
          { senderId: receiverId, receiverId: senderId },
        ],
      },
      order: [['createdAt', 'ASC']], // Pesan diurutkan berdasarkan waktu pembuatan
      include: [
        { model: User, as: 'Sender', attributes: ['username', 'profilePicture'] },
        { model: User, as: 'Receiver', attributes: ['username', 'profilePicture'] }
      ]
    });

    return res.status(200).json(messages);
  } catch (error) {
    console.error("Error mendapatkan pesan:", error);
    return res.status(500).json({ message: "Gagal mendapatkan pesan." });
  }
};
