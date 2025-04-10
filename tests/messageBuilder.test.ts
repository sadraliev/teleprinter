import { MessageBuilder } from "../src/teleprinter";
import { testFixtures } from "./fixtures/messageBuilder.fixture";

describe("MessageBuilder", () => {
  describe("basic messages", () => {
    test("should handle welcome text", () => {
      const builder = MessageBuilder(testFixtures.welcome);
      const result = builder.render();
      expect(result).toBeDefined();
      expect(typeof result).toBe("string");
      expect(result.length).toBeGreaterThan(0);
    });

    test("should handle bold text", () => {
      const builder = MessageBuilder(testFixtures.boldWizards);
      const result = builder.render();
      expect(result).toContain("&lt;strong&gt;bold&lt;/strong&gt;");
      expect(result).toContain("&lt;b&gt;bold&lt;/b&gt;");
    });

    test("should handle italic text", () => {
      const builder = MessageBuilder(testFixtures.italicFairies);
      const result = builder.render();
      expect(result).toContain("&lt;i&gt;italic&lt;/i&gt;");
      expect(result).toContain("&lt;em&gt;italic&lt;/em&gt;");
    });

    test("should handle underline text", () => {
      const builder = MessageBuilder(testFixtures.underlineSecrets);
      const result = builder.render();
      expect(result).toContain("&lt;u&gt;underline&lt;/u&gt;");
      expect(result).toContain("&lt;ins&gt;underline&lt;/ins&gt;");
    });

    test("should handle strikethrough text", () => {
      const builder = MessageBuilder(testFixtures.strikethroughSecrets);
      const result = builder.render();
      expect(result).toContain("&lt;s&gt;strikethrough&lt;/s&gt;");
      expect(result).toContain("&lt;strike&gt;strikethrough&lt;/strike&gt;");
      expect(result).toContain("&lt;del&gt;strikethrough&lt;/del&gt;");
    });

    test("should handle spoiler text", () => {
      const builder = MessageBuilder(testFixtures.spoilerMysteries);
      const result = builder.render();
      expect(result).toContain(
        "&lt;span class=&quot;tg-spoiler&quot;&gt;spoiler&lt;/span&gt;"
      );
    });

    test("should handle nested tags", () => {
      const builder = MessageBuilder(testFixtures.nestedTags);
      const result = builder.render();
      expect(result).toBeDefined();
      expect(typeof result).toBe("string");
      expect(result.length).toBeGreaterThan(0);

      // Check tag nesting order with escaped HTML
      const bIndex = result.indexOf("&lt;b&gt;");
      const iIndex = result.indexOf("&lt;i&gt;");
      const sIndex = result.indexOf("&lt;s&gt;");
      const spoilerIndex = result.indexOf(
        "&lt;span class=&quot;tg-spoiler&quot;&gt;"
      );
      const uIndex = result.indexOf("&lt;u&gt;");

      expect(bIndex).toBeLessThan(iIndex);
      expect(iIndex).toBeLessThan(sIndex);
      expect(sIndex).toBeLessThan(spoilerIndex);
      expect(spoilerIndex).toBeLessThan(uIndex);
    });

    test("should handle links", () => {
      const builder = MessageBuilder(testFixtures.links);
      const result = builder.render();
      expect(result).toContain(
        "&lt;a href=&quot;http://www.example.com/&quot;&gt;path of discovery&lt;/a&gt;"
      );
      expect(result).toContain(
        "&lt;a href=&quot;tg://user?id=123456789&quot;&gt;@Friend&lt;/a&gt;"
      );
    });

    test("should handle emoji", () => {
      const builder = MessageBuilder(testFixtures.emoji);
      const result = builder.render();
      expect(result).toContain(
        "&lt;tg-emoji emoji-id=&quot;5368324170671202286&quot;&gt;👍&lt;/tg-emoji&gt;"
      );
    });

    test("should handle code block", () => {
      const builder = MessageBuilder(testFixtures.codeBlock);
      const result = builder.render();
      expect(result).toContain("&lt;pre&gt;");
      expect(result).toContain(
        "&lt;code class=&quot;language-python&quot;&gt;"
      );
      expect(result).toContain("def magic_spell():");
    });

    test("should handle blockquotes", () => {
      const builder = MessageBuilder(testFixtures.blockquote);
      const result = builder.render();
      expect(result).toContain(
        "&lt;blockquote&gt;ancient texts&lt;/blockquote&gt;"
      );
    });

    test("should handle expandable blockquotes", () => {
      const builder = MessageBuilder(testFixtures.expandableBlockquote);
      const result = builder.render();
      expect(result).toContain(
        "&lt;blockquote expandable&gt;expandable library&lt;/blockquote&gt;"
      );
    });

    test("should handle conclusion text", () => {
      const builder = MessageBuilder(testFixtures.conclusion);
      const result = builder.render();
      expect(result).toBeDefined();
      expect(typeof result).toBe("string");
      expect(result.length).toBeGreaterThan(0);
    });

    // Additional tests from htmlText
    test("should handle inline code", () => {
      const builder = MessageBuilder(testFixtures.inlineCode);
      const result = builder.render();
      expect(result).toContain(
        "&lt;code&gt;inline fixed-width code&lt;/code&gt;"
      );
    });

    test("should handle pre-formatted blocks", () => {
      const builder = MessageBuilder(testFixtures.preBlock);
      const result = builder.render();
      expect(result).toContain(
        "&lt;pre&gt;pre-formatted fixed-width code block&lt;/pre&gt;"
      );
    });

    test("should handle multiline blockquotes", () => {
      const builder = MessageBuilder(testFixtures.blockquoteMultiline);
      const result = builder.render();
      expect(result).toContain("&lt;blockquote&gt;");
      expect(result).toContain("Block quotation started");
      expect(result).toContain("Block quotation continued");
      expect(result).toContain("The last line of the block quotation");
    });

    test("should handle multiline expandable blockquotes", () => {
      const builder = MessageBuilder(
        testFixtures.expandableBlockquoteMultiline
      );
      const result = builder.render();
      expect(result).toContain("&lt;blockquote expandable&gt;");
      expect(result).toContain("Expandable block quotation started");
      expect(result).toContain("Expandable block quotation continued");
      expect(result).toContain(
        "Hidden by default part of the block quotation started"
      );
    });
  });

  describe("complex messages", () => {
    test("should handle special characters and quotes", () => {
      const message = MessageBuilder()
        .row('Greetings, human! I am a "friendly" bot.')
        .row(
          'I enjoy solving your <problems> and ensuring you have "fun" with technology.'
        )
        .row(
          "No need for annoying escapes—this feels more like coding, and less like herding cats."
        )
        .render();

      const expected =
        "Greetings, human! I am a &quot;friendly&quot; bot.\n" +
        "I enjoy solving your &lt;problems&gt; and ensuring you have &quot;fun&quot; with technology.&lt;/problems&gt;\n" +
        "No need for annoying escapes—this feels more like coding, and less like herding cats.\n";

      expect(message).toBe(expected);
    });

    test("should handle order details with variables", () => {
      const status = "Clean, readable, and maintainable";
      const price = "priceless";
      const message = MessageBuilder()
        .row("<b>Welcome!</b>")
        .row("<i>Your order details:</i>")
        .row("Price: <code>", price, "</code>")
        .row("Status:", `<i>${status}</i>`)
        .row("<u>Note:</u> Delivery tomorrow")
        .render();

      const expected =
        "<b>Welcome!</b>\n" +
        "<i>Your order details:</i>\n" +
        "Price: <code> priceless </code>\n" +
        "Status: <i>Clean, readable, and maintainable</i>\n" +
        "<u>Note:</u> Delivery tomorrow\n";

      expect(message).toBe(expected);
    });

    test("should handle unsupported HTML tags", () => {
      const status = "awesome";
      const message = MessageBuilder()
        .row("<i>Clean, readable, and maintainable</i>")
        .row("<b>Status:</b>", status)
        .row("-------------------")
        .row("<b>Unsupported tags are ignored:</b>")
        .row("<article> Title </article>")
        .row("<problems>")
        .row("</problems>", "<b>bold</b>")
        .row("<div>div blocks <b>bold</b>  </div>")
        .row('<img src="https://example.com/image.jpg" />')
        .row("<br/>")
        .row("<hr/>")
        .render();

      const expected =
        "<i>Clean, readable, and maintainable</i>\n" +
        "<b>Status:</b> awesome\n" +
        "-------------------\n" +
        "<b>Unsupported tags are ignored:</b>\n" +
        "&lt;article&gt; Title &lt;/article&gt;&lt;/article&gt;\n" +
        "&lt;problems&gt;&lt;/problems&gt;\n" +
        "&lt;/problems&gt;<b>bold</b>\n" +
        "&lt;div&gt;div blocks <b>bold</b>&lt;/div&gt;\n" +
        "&lt;img src=&quot;https://example.com/image.jpg&quot; /&gt;\n" +
        "&lt;br/&gt;\n" +
        "&lt;hr/&gt;\n";

      expect(message).toBe(expected);
    });

    test("should handle emojis and links with empty rows", () => {
      const message = MessageBuilder()
        .row("👋 Welcome to the coolest bot on Telegram!")
        .row("Let's explore some awesome formatting examples...")
        .row()
        .row(
          "Check out markgram",
          `<a href="http://www.example.com/">path of discovery</a>`
        )
        .row("🚀", "👋")
        .render();

      const expected =
        "👋 Welcome to the coolest bot on Telegram!\n" +
        "Let&#39;s explore some awesome formatting examples...\n" +
        'Check out markgram <a href="http://www.example.com/">path of discovery</a>\n' +
        "🚀 👋\n";

      expect(message).toBe(expected);
    });

    test("should handle a complex message with all HTML tags", () => {
      const message = MessageBuilder()
        .row("Here's a creative text using the provided HTML tags:")
        .row()
        .row("Welcome to the Magical World of Code and Dreams!")
        .row()
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
        .row()
        .row(
          "But beware, for some secrets are hidden in <u>underline</u> and <ins>underline</ins> ancient tomes, waiting to be uncovered.",
          "Others, however, are <s>strikethrough</s>, <strike>strikethrough</strike>, or <del>strikethrough</del>"
        )
        .row()
        .row(
          'For those who dare to peek, a <span class="tg-spoiler">spoiler</span> awaits, revealing the deepest mysteries of the universe. Yet, even the bravest must be cautious,',
          'for some truths are wrapped in <b>bold <i>italic bold <s>italic bold strikethrough <span class="tg-spoiler">italic bold strikethrough spoiler</span></s> <u>underline italic bold</u></i> bold</b>'
        )
        .row()
        .row(
          'Follow the <a href="http://www.example.com/">path of discovery</a> and mention your fellow traveler <a href="tg://user?id=123456789">@Friend</a>.',
          ' Give a thumbs up with <tg-emoji emoji-id="5368324170671202286">👍</tg-emoji>.'
        )
        .row()
        .row("Here's a snippet of code:")
        .row()
        .row(
          '<pre><code class="language-python">',
          "def magic_spell():",
          '    print("Abracadabra!")',
          "</code></pre>"
        )
        .row()
        .row(
          "And remember, wisdom is found in ",
          "<blockquote>ancient texts</blockquote>",
          " that whisper secrets."
        )
        .row()
        .row(
          "For more, there's an ",
          "<blockquote expandable>expandable library</blockquote>",
          " filled with hidden truths."
        )
        .row()
        .row('So, take your first step into this <mystical> "world!"')
        .render();

      const expected =
        "Here&#39;s a creative text using the provided HTML tags:\n" +
        "Welcome to the Magical World of Code and Dreams!\n" +
        "In this enchanted realm, <b>bold</b> and <b>bold</b> wizards cast their spells with precision. Meanwhile, <i>italic</i> and <i>italic</i> fairies dance under the moonlight.\n" +
        "But beware, for some secrets are hidden in <u>underline</u> and <u>underline</u> ancient tomes, waiting to be uncovered. Others, however, are <s>strikethrough</s>, <s>strikethrough</s>, or <s>strikethrough</s>\n" +
        "For those who dare to peek, a <tg-spoiler>spoiler</tg-spoiler> awaits, revealing the deepest mysteries of the universe. Yet, even the bravest must be cautious, for some truths are wrapped in <b>bold <i>italic bold <s>italic bold strikethrough <tg-spoiler>italic bold strikethrough spoiler</tg-spoiler></s><u>underline italic bold</u></i> bold</b>\n" +
        'Follow the <a href="http://www.example.com/">path of discovery</a> and mention your fellow traveler <a href="tg://user?id=123456789">@Friend</a>. Give a thumbs up with <tg-emoji emoji-id="5368324170671202286">👍</tg-emoji>.\n' +
        "Here&#39;s a snippet of code:\n" +
        '<pre><code class="language-python" > def magic_spell(): print(&quot;Abracadabra!&quot;) </code></pre>\n' +
        "And remember, wisdom is found in <blockquote>ancient texts</blockquote> that whisper secrets.\n" +
        "For more, there&#39;s an <blockquote>expandable library</blockquote> filled with hidden truths.\n" +
        "So, take your first step into this &lt;mystical&gt; &quot;world!&quot;&lt;/mystical&gt;\n";

      expect(message).toBe(expected);
    });
  });
});
