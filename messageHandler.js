const fs = require('fs');
const path = require('path');

async function autoReply(messages, sock) {
    // Ambil pesan pertama dari array messages
    const message = messages[0];

    // Memeriksa apakah pesan memiliki teks (conversation)
    if (message.message?.conversation) {
        const messageContent = message.message.conversation;
        const sender = message.key.remoteJid;

        console.log(`Pesan dari ${sender}: ${messageContent}`);

        try {
            // Memeriksa apakah file gambar tersedia
            const imagePath = path.join(__dirname, 'assets/off.jpg');
            if (!fs.existsSync(imagePath)) {
                console.error("Gambar tidak ditemukan di path:", imagePath);
                return;
            }

            // Mengirim balasan gambar dengan caption
            await sock.sendMessage(sender, {
                image: fs.readFileSync(imagePath),
                caption: "Maaf user ini sedang offline\n\n\n_*#Bot_WhatsApp*_"
            });
        } catch (error) {
            console.error("Gagal mengirim gambar:", error);
        }
    }
}

module.exports = {
    autoReply
};
