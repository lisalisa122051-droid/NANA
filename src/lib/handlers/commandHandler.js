import { normalizeButtons, sendButtons } from "../utils.js";

export function createCommandRouter({ config }) {
  const commands = new Map();

  function registerCommand(name, handler) {
    commands.set(name.toLowerCase(), handler);
  }

  async function dispatch(ctx, commandName) {
    const cmd = (commandName || "").toLowerCase();
    const handler = commands.get(cmd);

    if (!handler) return false;

    await handler(ctx);
    return true;
  }

  // Built-in commands (tombol wajib)
  registerCommand("menu", async (ctx) => {
    const buttons = normalizeButtons(config.MAIN_MENU_BUTTONS, config.NAV_BUTTONS);
    await sendButtons(ctx.sock, ctx.jid, {
      text: "Pilih menu:",
      footer: config.FOOTER,
      buttons
    }, { quoted: ctx.quoted });
  });

  registerCommand("ping", async (ctx) => {
    const buttons = normalizeButtons(
      [
        { id: "cmd_ping", text: "Ping lagi" },
        { id: "cmd_menu", text: "Menu" }
      ],
      config.NAV_BUTTONS
    );

    await sendButtons(ctx.sock, ctx.jid, {
      text: "PONG ✅",
      footer: config.FOOTER,
      buttons
    }, { quoted: ctx.quoted });
  });

  registerCommand("info", async (ctx) => {
    const buttons = normalizeButtons(
      [
        { id: "cmd_example", text: "Plugin contoh" },
        { id: "cmd_menu", text: "Menu" }
      ],
      config.NAV_BUTTONS
    );

    await sendButtons(ctx.sock, ctx.jid, {
      text: "Info:\n- Framework: kiuur/baileys\n- Mode: tombol wajib",
      footer: config.FOOTER,
      buttons
    }, { quoted: ctx.quoted });
  });

  registerCommand("owner", async (ctx) => {
    const buttons = normalizeButtons(
      [{ id: "cmd_menu", text: "Menu" }],
      config.NAV_BUTTONS
    );

    await sendButtons(ctx.sock, ctx.jid, {
      text: `Owner: wa.me/${config.OWNER_NUMBER}`,
      footer: config.FOOTER,
      buttons
    }, { quoted: ctx.quoted });
  });

  return { registerCommand, dispatch };
}
