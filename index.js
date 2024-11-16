const path = require('path');
const makeWASocket = require('@whiskeysockets/baileys').default;
const { useMultiFileAuthState } = require('@whiskeysockets/baileys');
const qrcode = require('qrcode-terminal');
const pino = require('pino');
const { autoReply } = require(path.join(__dirname,'messageHandler'));

const logger = pino({ level: 'silent' });

async function connectToWhatsApp() {
    const { state, saveCreds } = await useMultiFileAuthState(path.join(__dirname,'autoreply_session'));

    const sock = makeWASocket({
        auth: state,
        logger
    });

    sock.ev.on('connection.update', (update) => {
        const { connection, qr } = update;
        if (qr) {
            qrcode.generate(qr, { small: true });
            console.log("Silakan scan QR code menggunakan WhatsApp Anda");
        }
        if (connection === 'open') {
            console.log('Bot terhubung ke WhatsApp!');
        }
    });

    sock.ev.on("creds.update", saveCreds);

    sock.ev.on("messages.upsert", async ({ messages, type }) => {
        await autoReply(messages, sock);
    });
}

connectToWhatsApp();