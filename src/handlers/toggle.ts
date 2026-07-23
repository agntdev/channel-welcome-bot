import { Composer } from "grammy";
import type { Ctx } from "../bot.js";
import { registerMainMenuItem, inlineButton, inlineKeyboard } from "../toolkit/index.js";

registerMainMenuItem({ label: "🔀 Toggle", data: "toggle:run", order: 20 });

const composer = new Composer<Ctx>();

const backToMenu = inlineKeyboard([[inlineButton("⬅️ Back to menu", "menu:main")]]);

function statusText(enabled: boolean): string {
  return enabled
    ? "Auto-reply is now ON — new posts will get a reply."
    : "Auto-reply is now OFF — new posts won't get a reply.";
}

composer.command("toggle", async (ctx) => {
  ctx.session.settings.enabled = !ctx.session.settings.enabled;
  await ctx.reply(statusText(ctx.session.settings.enabled), { reply_markup: backToMenu });
});

composer.callbackQuery("toggle:run", async (ctx) => {
  await ctx.answerCallbackQuery();
  ctx.session.settings.enabled = !ctx.session.settings.enabled;
  await ctx.editMessageText(statusText(ctx.session.settings.enabled), {
    reply_markup: backToMenu,
  });
});

export default composer;
