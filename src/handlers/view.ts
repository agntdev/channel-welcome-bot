import { Composer } from "grammy";
import type { Ctx } from "../bot.js";
import { registerMainMenuItem, inlineButton, inlineKeyboard } from "../toolkit/index.js";

registerMainMenuItem({ label: "👁 View config", data: "view:show", order: 30 });

const composer = new Composer<Ctx>();

const backToMenu = inlineKeyboard([[inlineButton("⬅️ Back to menu", "menu:main")]]);

composer.command("view", async (ctx) => {
  const { auto_reply_text, enabled, notification_enabled } = ctx.session.settings;
  const lines = [
    `Status: ${enabled ? "ON" : "OFF"}`,
    `Notifications: ${notification_enabled ? "ON" : "OFF"}`,
    "",
    "Reply text:",
    auto_reply_text || "(none set)",
  ];
  await ctx.reply(lines.join("\n"), { reply_markup: backToMenu });
});

composer.callbackQuery("view:show", async (ctx) => {
  await ctx.answerCallbackQuery();
  const { auto_reply_text, enabled, notification_enabled } = ctx.session.settings;
  const lines = [
    `Status: ${enabled ? "ON" : "OFF"}`,
    `Notifications: ${notification_enabled ? "ON" : "OFF"}`,
    "",
    "Reply text:",
    auto_reply_text || "(none set)",
  ];
  await ctx.editMessageText(lines.join("\n"), { reply_markup: backToMenu });
});

export default composer;
