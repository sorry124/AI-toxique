// index.js
import makeWASocket, { useSingleFileAuthState, DisconnectReason } from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import config from './config.js';
import { generateReply, getRandomSticker } from './that.js';
import { initDB } from './db.js';

const { state, saveState } = useSingleFileAuthState(`./${config.SESSION_ID}.json`);

async function startBot() {
  await initDB();

  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: false,
  });

  sock.ev.on('creds.update', saveState);

  let aiEnabled = true;

  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect } = update;
    if(connection === 'close') {
      if ((lastDisconnect.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut) {
        startBot();
      } else {
        console.log('Déconnecté. Veuillez supprimer la session et recommencer.');
      }
    } else if(connection === 'open') {
      console.log('Bot connecté');
    }
  });

  sock.ev.on('messages.upsert', async ({ messages, type }) => {
    if(type !== 'notify') return;
    const msg = messages[0];
    if(!msg.message || msg.key.fromMe) return;

    const sender = msg.key.remoteJid;
    const text = msg.message.conversation || msg.message.extendedTextMessage?.text || '';
    const isGroup = sender.endsWith('@g.us');
    const isOwner = msg.key.participant === config.OWNER_NUMBER || sender === config.OWNER_NUMBER;

    // Seul le propriétaire peut activer/désactiver l'IA
    if(text.startsWith(`${config.BOT_PREFIX}ai `) && isOwner) {
      const cmd = text.split(' ')[1].toLowerCase();
      if(cmd === 'on') {
        aiEnabled = true;
        await sock.sendMessage(sender, { text: 'Mode IA activé.' }, { quoted: msg });
      } else if(cmd === 'off') {
        aiEnabled = false;
        await sock.sendMessage(sender, { text: 'Mode IA désactivé.' }, { quoted: msg });
      }
      return;
    }

    // Si l'IA est désactivée, on ne répond pas
    if(!aiEnabled) return;

    // Répond uniquement si le bot est mentionné ou en message direct
    let isMentioned = false;
    if(isGroup) {
      const mentions = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
      isMentioned = mentions.includes(sock.user.id);
    } else {
      isMentioned = true;
    }

    if(!isMentioned) return;

    const prompt = text;

    const replyText = await generateReply(sender, prompt);

    const stickerUrl = getRandomSticker();

    // Envoi message texte
    await sock.sendMessage(sender, { text: replyText }, { quoted: msg });

    // Envoi sticker si disponible
    if(stickerUrl){
      try {
        const stickerBuffer = await fetchStickerBuffer(stickerUrl);
        await sock.sendMessage(sender, { sticker: stickerBuffer }, { quoted: msg });
      } catch {
        // ignore erreur sticker
      }
    }
  });

  async function fetchStickerBuffer(url) {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  }
}

startBot();
