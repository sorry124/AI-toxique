import baileys from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import dotenv from 'dotenv';

dotenv.config();

const {
  makeWASocket,
  fetchLatestBaileysVersion,
  DisconnectReason,
  initAuthCreds
} = baileys;

const SESSION_ID = process.env.SESSION_ID;
const OWNER_NUMBER = '+22395064497';

if (!SESSION_ID) {
  console.error('❌ La variable SESSION_ID est vide ou non définie');
  process.exit(1);
}

console.log('🚀 Démarrage du bot...');

// 🔓 Décoder la SESSION_ID
async function getAuthFromSessionId(sessionId) {
  const creds = initAuthCreds();

  try {
    const payload = sessionId.split("~")[2];
    const decoded = Buffer.from(payload, 'base64url').toString();
    const session = JSON.parse(decoded);

    Object.assign(creds, session.creds);

    return {
      state: {
        creds,
        keys: {
          get: () => ({}),
          set: () => {},
          setKeys: () => {},
          getKeys: () => []
        }
      },
      saveCreds: async () => {}
    };
  } catch (err) {
    console.error('❌ Erreur lors du décodage de la SESSION_ID :', err.message);
    process.exit(1);
  }
}

async function startBot() {
  const { state, saveCreds } = await getAuthFromSessionId(SESSION_ID);
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    auth: state,
    printQRInTerminal: false
  });

  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === 'open') {
      console.log('✅ Bot connecté à WhatsApp !');

      await sock.sendMessage(OWNER_NUMBER + '@s.whatsapp.net', {
        text: `🤖 Le bot est maintenant connecté avec succès !`
      });
    } else if (connection === 'close') {
      const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
      console.log('🔌 Déconnexion du bot, reconnexion :', shouldReconnect);
      if (shouldReconnect) startBot();
    }
  });

  sock.ev.on('messages.upsert', async ({ messages }) => {
    const msg = messages[0];
    if (!msg.message || msg.key.fromMe) return;

    const sender = msg.key.remoteJid;
    const text = msg.message?.conversation || msg.message?.extendedTextMessage?.text || "";

    if (text.toLowerCase().includes('salut')) {
      await sock.sendMessage(sender, { text: "Yo 😎" });
    }
  });
}

startBot();
