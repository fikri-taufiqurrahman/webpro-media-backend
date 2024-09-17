import { Message, User } from "../models/index.js";

// Mengirim pesan baru
export const sendMessage = async (req, res) => {
  const { senderId, receiverId, messageText } = req.body;

  try {
    // Validasi input
    if (!senderId || !receiverId || !messageText) {
      return res.status(400).json({ message: "Semua data harus diisi." });
    }

    // Buat pesan baru
    const newMessage = await Message.create({
      senderId,
      receiverId,
      messageText,
    });

    return res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error mengirim pesan:", error);
    return res.status(500).json({ message: "Gagal mengirim pesan." });
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
