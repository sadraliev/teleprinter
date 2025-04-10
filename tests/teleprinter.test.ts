import {
  toBold,
  toItalic,
  toUnderline,
  toStrike,
  toSpoiler,
  Link,
  toCode,
  toPre,
  toBlockquote,
  Row,
  Space,
  MessageBuilder,
} from "../src/teleprinter";

describe("teleprinter", () => {
  describe("text formatting", () => {
    test("should format bold text", () => {
      expect(toBold("Hello")).toBe("<b>Hello</b>");
    });

    test("should format italic text", () => {
      expect(toItalic("Hello")).toBe("<i>Hello</i>");
    });

    test("should format underlined text", () => {
      expect(toUnderline("Hello")).toBe("<u>Hello</u>");
    });

    test("should format strikethrough text", () => {
      expect(toStrike("Hello")).toBe("<s>Hello</s>");
    });

    test("should format spoiler text", () => {
      expect(toSpoiler("Hello")).toBe("<tg-spoiler>Hello</tg-spoiler>");
    });

    test("should format code text", () => {
      expect(toCode("Hello")).toBe("<code>Hello</code>");
    });

    test("should format pre text", () => {
      expect(toPre("Hello")).toBe("<pre>Hello</pre>");
    });

    test("should format blockquote text", () => {
      expect(toBlockquote("Hello")).toBe("<blockquote>Hello</blockquote>");
    });
  });

  describe("link formatting", () => {
    test("should format link with text", () => {
      const link = Link("https://example.com", "Example");
      expect(link.render()).toBe('<a href="https://example.com">Example</a>');
    });
  });

  describe("layout components", () => {
    test("should create a row with text", () => {
      const row = Row("Hello", "World");
      expect(row.render()).toBe("Hello World\n");
    });

    test("should create multiple spaces", () => {
      const space = Space(3);
      expect(space.render()).toBe("\n\n\n");
    });
  });

  describe("MessageBuilder", () => {
    test("should create a simple message", () => {
      const builder = MessageBuilder("Hello");
      expect(builder.render()).toBe("Hello");
    });

    test("should add rows to message", () => {
      const builder = MessageBuilder("Hello").row("World").row("!");
      expect(builder.render()).toBe("Hello\nWorld\n!\n");
    });

    test("should add spaces between rows", () => {
      const builder = MessageBuilder("Hello").row().row("World");
      expect(builder.render()).toBe("Hello\nWorld\n");
    });
  });
});
