import { parser } from "../src/parser";

describe("parser", () => {
  test("should parse simple text", () => {
    const result = parser("Hello World");
    expect(result).toEqual([
      {
        type: "text",
        content: "Hello World",
      },
    ]);
  });

  test("should parse bold text", () => {
    const result = parser("<b>Hello</b> World");
    expect(result).toEqual([
      {
        type: "tag",
        tag: "b",
        attributes: {},
        children: [
          {
            type: "text",
            content: "Hello",
          },
        ],
      },
      {
        type: "text",
        content: " World",
      },
    ]);
  });

  test("should parse nested tags", () => {
    const result = parser("<b>Hello <i>World</i></b>");
    expect(result).toEqual([
      {
        type: "tag",
        tag: "b",
        attributes: {},
        children: [
          {
            type: "text",
            content: "Hello ",
          },
          {
            type: "tag",
            tag: "i",
            attributes: {},
            children: [
              {
                type: "text",
                content: "World",
              },
            ],
          },
        ],
      },
    ]);
  });

  test("should parse tags with attributes", () => {
    const result = parser('<a href="https://example.com">Link</a>');
    expect(result).toEqual([
      {
        type: "tag",
        tag: "a",
        attributes: {
          href: "https://example.com",
        },
        children: [
          {
            type: "text",
            content: "Link",
          },
        ],
      },
    ]);
  });
});
