const { Bot } = require("grammy");
const {
  Render,
  Space,
  Bold,
  Italic,
  Underline,
  Strike,
  Spoiler,
  Link,
  Code,
  Pre,
  Quote,
  Emoji,
  Row,
} = require("./teletype");

const bot = new Bot(process.env.BOT_TOKEN);
// 🎉 Start Command Handler with a Creative Welcome Message
bot.command("start", (ctx) =>
  bot.api.sendMessage(
    ctx.chat.id,
    Render(
      Row(Bold("👋 Welcome to the coolest bot on Telegram!")),
      Row(Italic("Let's explore some awesome formatting examples...")),
      Row(Space()),
      Row(Link("Check out markgram", "https://github.com")),
      Row(Emoji("🚀"), Emoji("👋"))
    ),
    { parse_mode: "HTML" }
  )
);

// 💬 Message Handler with Interactive and Fun Examples
bot.on("message", async (ctx) => {
  await bot.api.sendMessage(
    ctx.chat.id,
    Render(
      Row(
        Quote(
          "💡 Pro Tip:",
          Spoiler("Always test your code before deployment! 🛡️")
        )
      ),
      Space(),
      Row(
        Row(Bold("🔥 Hot feature:")),
        Row(Space()),
        Row(Italic(" Multiple text styles combined!")),
        Row(Space()),
        Row(Underline("Stay sharp!")),
        Row(Space()),
        Row(Strike("Buggy code be gone!"))
      ),
      Row(Link("✨ Explore more examples", "https://example.com"), Emoji("🔥")),
      Space(),
      Row(
        Code("console.log('Coding is fun!');"),
        Space(2),
        Pre(
          "javascript",
          "const awesome = true;\nif (awesome) console.log('Keep coding!');"
        )
      ),
      Space(),
      Row(
        Quote(
          "👨‍💻 Developer Wisdom: " +
            "\n'Good code is like a joke — it needs no explanation.'"
        ),
        Space(2),
        Spoiler("Here is the secret to success: Keep learning! 💪")
      )
    ),
    { parse_mode: "HTML" }
  );
});

bot.start();
