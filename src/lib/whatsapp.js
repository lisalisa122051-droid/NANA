import makeWASocket, {
  DisconnectReason,
  useMultiFileAuthState,
  fetchLatestBaileysVersion
} from "baileys";
import qrcode from "qrcode-terminal";
import P from "pino";

export async function createWhatsAppClient({ sessionDir }) {
  const logger = P({ level: "silent" });
  const { state, saveCreds } = await useMultiFileAuthState(sessionDir);

  // fetchLatestBaileysVersion kadang sensitif; jadi kita fallback aman
  let version;
  try {
    const v = await fetchLatestBaileysVersion();
    version = v?.version;
  } catch {
    version = undefined;
  }

  const sock = makeWASocket({
    logger,
    auth: state,
    version,
    browser: ["BotBaileys", "Chrome", "1.0.0"],
    markOnlineOnConnect: false
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      qrcode.generate(qr, { small: true });
      console.log("Scan QR di atas pakai WhatsApp kamu.");
    }

    if (connection === "open") {
      console.log("✅ Connected!");
    }

    if (connection === "close") {
      const statusCode = lastDisconnect?.error?.output?.statusCode;
      const shouldReconnect = statusCode !== DisconnectReason.loggedOut;
      console.log("❌ Disconnected:", statusCode, "reconnect:", shouldReconnect);

      if (shouldReconnect) {
        // biar index.js yang handle re-init (lebih rapi), cukup emit info
      }
    }
  });

  return sock;
}
