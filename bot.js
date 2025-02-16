const { Bot } = require("grammy");
const { MessageBuilder } = require("./teletype");

const bot = new Bot(process.env.BOT_TOKEN);

bot.command("start", (ctx) => {
  const message = new MessageBuilder()
    .row("👋 Welcome to the coolest bot on Telegram!")
    .row("Let's explore some awesome formatting examples...")
    .space()
    .row(
      "Check out markgram",
      `<a href="http://www.example.com/">path of discovery</a>`
    )
    .row("🚀", "👋")
    .render();

  bot.api.sendMessage(ctx.chat.id, message, { parse_mode: "HTML" });
});

// 💬 Message Handler with Interactive and Fun Examples
bot.on("message", async (ctx) => {
  const message = new MessageBuilder()
    .row("Here's a creative text using the provided HTML tags:")
    .space()
    .row("Welcome to the Magical World of Code and Dreams!")
    .space()
    .row(
      "In this enchanted realm,",
      "<strong>bold</strong>",
      "and",
      "<b>bold</b>",
      "wizards cast their spells with precision. Meanwhile,",
      "<i>italic</i>",
      "and",
      "<em>italic</em>",
      "fairies dance under the moonlight."
    )
    .space()
    .row(
      "But beware, for some secrets are hidden in <u>underline</u> and <ins>underline</ins> ancient tomes, waiting to be uncovered.",
      "Others, however, are <s>strikethrough</s>, <strike>strikethrough</strike>, or <del>strikethrough</del>"
    )
    .space()
    .row(
      'For those who dare to peek, a <span class="tg-spoiler">spoiler</span> awaits, revealing the deepest mysteries of the universe. Yet, even the bravest must be cautious,',
      'for some truths are wrapped in <b>bold <i>italic bold <s>italic bold strikethrough <span class="tg-spoiler">italic bold strikethrough spoiler</span></s> <u>underline italic bold</u></i> bold</b>'
    )
    .space()
    .row(
      'Follow the <a href="http://www.example.com/">path of discovery</a> and mention your fellow traveler <a href="tg://user?id=123456789">@Friend</a>.',
      ' Give a thumbs up with <tg-emoji emoji-id="5368324170671202286">👍</tg-emoji>.'
    )
    .space()
    .row("Here's a snippet of code:")
    .space()
    .row(
      '<pre><code class="language-python">',
      "def magic_spell():",
      '    print("Abracadabra!")',
      "</code></pre>"
    )
    .space()
    .row(
      "And remember, wisdom is found in ",
      "<blockquote>ancient texts</blockquote>",
      " that whisper secrets."
    )
    .space()
    .row(
      "For more, there's an ",
      "<blockquote expandable>expandable library</blockquote>",
      " filled with hidden truths."
    )
    .space()
    .row("So, take your first step into this mystical world!")
    .render();

  await bot.api.sendMessage(ctx.chat.id, message, { parse_mode: "HTML" });
});

bot.start();
