import { MessageBuilder } from "../src/teleprinter";
import { testFixtures } from "./fixtures/messageBuilder.fixture";

describe("MessageBuilder", () => {
  test("should handle welcome text", () => {
    const builder = new MessageBuilder(testFixtures.welcome);
    const result = builder.render();
    expect(result).toBeDefined();
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });

  test("should handle bold text", () => {
    const builder = new MessageBuilder(testFixtures.boldWizards);
    const result = builder.render();
    expect(result).toContain("&lt;strong&gt;bold&lt;/strong&gt;");
    expect(result).toContain("&lt;b&gt;bold&lt;/b&gt;");
  });

  test("should handle italic text", () => {
    const builder = new MessageBuilder(testFixtures.italicFairies);
    const result = builder.render();
    expect(result).toContain("&lt;i&gt;italic&lt;/i&gt;");
    expect(result).toContain("&lt;em&gt;italic&lt;/em&gt;");
  });

  test("should handle underline text", () => {
    const builder = new MessageBuilder(testFixtures.underlineSecrets);
    const result = builder.render();
    expect(result).toContain("&lt;u&gt;underline&lt;/u&gt;");
    expect(result).toContain("&lt;ins&gt;underline&lt;/ins&gt;");
  });

  test("should handle strikethrough text", () => {
    const builder = new MessageBuilder(testFixtures.strikethroughSecrets);
    const result = builder.render();
    expect(result).toContain("&lt;s&gt;strikethrough&lt;/s&gt;");
    expect(result).toContain("&lt;strike&gt;strikethrough&lt;/strike&gt;");
    expect(result).toContain("&lt;del&gt;strikethrough&lt;/del&gt;");
  });

  test("should handle spoiler text", () => {
    const builder = new MessageBuilder(testFixtures.spoilerMysteries);
    const result = builder.render();
    expect(result).toContain(
      "&lt;span class=&quot;tg-spoiler&quot;&gt;spoiler&lt;/span&gt;"
    );
  });

  test("should handle nested tags", () => {
    const builder = new MessageBuilder(testFixtures.nestedTags);
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
    const builder = new MessageBuilder(testFixtures.links);
    const result = builder.render();
    expect(result).toContain(
      "&lt;a href=&quot;http://www.example.com/&quot;&gt;path of discovery&lt;/a&gt;"
    );
    expect(result).toContain(
      "&lt;a href=&quot;tg://user?id=123456789&quot;&gt;@Friend&lt;/a&gt;"
    );
  });

  test("should handle emoji", () => {
    const builder = new MessageBuilder(testFixtures.emoji);
    const result = builder.render();
    expect(result).toContain(
      "&lt;tg-emoji emoji-id=&quot;5368324170671202286&quot;&gt;👍&lt;/tg-emoji&gt;"
    );
  });

  test("should handle code block", () => {
    const builder = new MessageBuilder(testFixtures.codeBlock);
    const result = builder.render();
    expect(result).toContain("&lt;pre&gt;");
    expect(result).toContain("&lt;code class=&quot;language-python&quot;&gt;");
    expect(result).toContain("def magic_spell():");
  });

  test("should handle blockquotes", () => {
    const builder = new MessageBuilder(testFixtures.blockquote);
    const result = builder.render();
    expect(result).toContain(
      "&lt;blockquote&gt;ancient texts&lt;/blockquote&gt;"
    );
  });

  test("should handle expandable blockquotes", () => {
    const builder = new MessageBuilder(testFixtures.expandableBlockquote);
    const result = builder.render();
    expect(result).toContain(
      "&lt;blockquote expandable&gt;expandable library&lt;/blockquote&gt;"
    );
  });

  test("should handle conclusion text", () => {
    const builder = new MessageBuilder(testFixtures.conclusion);
    const result = builder.render();
    expect(result).toBeDefined();
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });

  // Additional tests from htmlText
  test("should handle inline code", () => {
    const builder = new MessageBuilder(testFixtures.inlineCode);
    const result = builder.render();
    expect(result).toContain(
      "&lt;code&gt;inline fixed-width code&lt;/code&gt;"
    );
  });

  test("should handle pre-formatted blocks", () => {
    const builder = new MessageBuilder(testFixtures.preBlock);
    const result = builder.render();
    expect(result).toContain(
      "&lt;pre&gt;pre-formatted fixed-width code block&lt;/pre&gt;"
    );
  });

  test("should handle multiline blockquotes", () => {
    const builder = new MessageBuilder(testFixtures.blockquoteMultiline);
    const result = builder.render();
    expect(result).toContain("&lt;blockquote&gt;");
    expect(result).toContain("Block quotation started");
    expect(result).toContain("Block quotation continued");
    expect(result).toContain("The last line of the block quotation");
  });

  test("should handle multiline expandable blockquotes", () => {
    const builder = new MessageBuilder(
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
