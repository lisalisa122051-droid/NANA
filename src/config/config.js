export default {
  SESSION_DIR: "sessions",

  // Opsional: kalau mau command pakai prefix, mis. "." atau "!"
  PREFIX: ".",

  // Owner (format internasional tanpa +), contoh Indonesia:
  // "6281234567890"
  OWNER_NUMBER: "6280000000000",

  // Default tombol untuk navigasi (SELALU dipasang kalau slot masih ada)
  NAV_BUTTONS: [
    { id: "cmd_menu", text: "📋 Menu" }
  ],

  // Menu utama (3 tombol biar aman)
  MAIN_MENU_BUTTONS: [
    { id: "cmd_ping", text: "🏓 Ping" },
    { id: "cmd_info", text: "ℹ️ Info" },
    { id: "cmd_owner", text: "👤 Owner" }
  ],

  FOOTER: "Bot Baileys (kiuur) • tombol wajib",

  // mode kirim tombol:
  // "buttons" = legacy buttons
  // "interactive" = interactiveMessage (native flow) — optional
  BUTTON_MODE: "buttons"
};
