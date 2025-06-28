import makeWASocket, {
  useSingleFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore,
} from "@whiskeysockets/baileys";
import { Boom } from "@hapi/boom";
import pino from "pino";
import { handlerMessage } from "./that.js";
import * as dotenv from "dotenv";
dotenv.config();

const { state, saveState } = useSingleFileAuthState("./session.json");
const sock = makeWASocket({
  logger: pino({ level: "silent" }),
  printQRInTerminal: false,
  auth: {
    creds: state.creds,
    keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "silent" })),
  },
  browser: ["Macintosh", "Safari", "16.0"],
});

sock.ev.on("connection.update", (update) => {
  const { connection, lastDisconnect } = update;
  if (connection === "close") {
    const shouldReconnect =
      lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
    console.log("Connexion fermée, reconnexion :", shouldReconnect);
    if (shouldReconnect) startSock();
  } else if (connection === "open") {
    console.log("✅ Bot connecté avec succès !");
  }
});

sock.ev.on("messages.upsert", async ({ messages }) => {
  const msg = messages[0];
  if (!msg.message || msg.key.fromMe) return;
  try {
    await handlerMessage(sock, msg);
  } catch (err) {
    console.error("Erreur dans le message handler:", err);
  }
});

sock.ev.on("creds.update", saveState);

function startSock() {
  sock;
}

startSock();
