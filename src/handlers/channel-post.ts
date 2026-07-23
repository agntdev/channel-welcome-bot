import { Composer } from "grammy";
import type { Ctx } from "../bot.js";
import type { Chat } from "grammy/types";

const composer = new Composer<Ctx>();

composer.on("channel_post", async (ctx) => {
  const post = ctx.channelPost;
  if (!post) return;

  const chatId = (post.chat as Chat.ChannelChat).id;
  const channelId = String(chatId);

  const settings = ctx.session.settings;
  if (!settings || !settings.enabled) return;

  const text = settings.auto_reply_text;
  if (!text) return;

  try {
    await ctx.api.sendMessage(chatId, text, {
      reply_parameters: { message_id: post.message_id },
    });
  } catch (err) {
    console.error(`[channel-welcome] failed to post reply in ${channelId}:`, err);

    if (settings.notification_enabled) {
      try {
        await ctx.api.sendMessage(chatId, "⚠️ Couldn't post the auto-reply. Check the bot's permissions in this channel.");
      } catch {
        // Notification best-effort — don't loop.
      }
    }
  }
});

export default composer;
