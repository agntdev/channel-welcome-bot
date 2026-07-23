import { Composer } from "grammy";
import type { Ctx } from "../bot.js";
import { registerMainMenuItem, inlineButton, inlineKeyboard } from "../toolkit/index.js";

registerMainMenuItem({ label: "✏️ Set reply", data: "set:text", order: 10 });

const composer = new Composer<Ctx>();

const SET_PROMPT =
  "Send me the text you want posted as a reply under new channel posts.";

const SET_DONE = "Auto-reply text updated.";

const backToMenu = inlineKeyboard([[inlineButton("⬅️ Back to menu", "menu:main")]]);

composer.command("set", async (ctx) => {
  ctx.session.step = "awaiting_set_text";
  await ctx.reply(SET_PROMPT);
});

composer.callbackQuery("set:text", async (ctx) => {
  await ctx.answerCallbackQuery();
  ctx.session.step = "awaiting_set_text";
  await ctx.editMessageText(SET_PROMPT, { reply_markup: backToMenu });
});

composer.on("message", async (ctx, next) => {
  if (ctx.session.step === "awaiting_set_text" && ctx.message.text) {
    const text = ctx.message.text.trim();
    if (!text) {
      await ctx.reply("Text can't be empty — try again.");
      return;
    }
    ctx.session.settings.auto_reply_text = text;
    ctx.session.step = undefined;
    await ctx.reply(SET_DONE, { reply_markup: backToMenu });
    return;
  }
  await next();
});

export default composer;
