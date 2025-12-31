export function getTextFromMessage(message) {
  return (
    message?.conversation ||
    message?.extendedTextMessage?.text ||
    message?.imageMessage?.caption ||
    message?.videoMessage?.caption ||
    ""
  );
}

export function getButtonReplyId(m) {
  // legacy buttons reply
  const br = m?.message?.buttonsResponseMessage;
  if (br?.selectedButtonId) return br.selectedButtonId;

  // template buttons reply
  const tbr = m?.message?.templateButtonReplyMessage;
  if (tbr?.selectedId) return tbr.selectedId;

  // interactive response (native flow)
  const ir = m?.message?.interactiveResponseMessage;
  const paramsJson = ir?.nativeFlowResponseMessage?.paramsJson;
  if (paramsJson) {
    try {
      const parsed = JSON.parse(paramsJson);
      if (parsed?.id) return parsed.id;
      if (parsed?.selected_id) return parsed.selected_id;
    } catch {}
  }

  return null;
}

export function normalizeButtons(buttons = [], navButtons = []) {
  // WA buttons biasanya aman 1-3
  const merged = [...buttons];

  for (const nb of navButtons) {
    if (merged.find((b) => b.id === nb.id)) continue;
    merged.push(nb);
    if (merged.length >= 3) break;
  }

  // Pastikan minimal 1 tombol
  if (merged.length === 0) merged.push({ id: "cmd_menu", text: "📋 Menu" });

  return merged.slice(0, 3);
}

export async function sendButtons(sock, jid, { text, footer, buttons }, opts = {}) {
  const payload = {
    text,
    footer,
    buttons: buttons.map((b) => ({
      buttonId: b.id,
      buttonText: { displayText: b.text },
      type: 1
    })),
    headerType: 1
  };

  return sock.sendMessage(jid, payload, opts);
}

// Optional: interactiveMessage sesuai contoh di repo kiuur/baileys  [oai_citation:1‡GitHub](https://github.com/kiuur/baileys)
export async function sendInteractive(sock, jid, { header, title, footer, button }, opts = {}) {
  const payload = {
    interactiveMessage: {
      header: header ?? "Hello",
      title: title ?? "Menu",
      footer: footer ?? "",
      buttons: [
        {
          name: "cta_copy",
          buttonParamsJson: JSON.stringify({
            display_text: button?.text ?? "Copy",
            id: button?.id ?? "copy_1",
            copy_code: button?.copy ?? "ABC123XYZ"
          })
        }
      ]
    }
  };

  return sock.sendMessage(jid, payload, opts);
}

export function pickCommand({ prefix, text }) {
  const raw = (text || "").trim();
  if (!raw) return "";

  // jika pakai prefix, ambil setelah prefix
  if (prefix && raw.startsWith(prefix)) return raw.slice(prefix.length).trim().toLowerCase();

  // tanpa prefix: anggap command langsung
  return raw.toLowerCase();
}
