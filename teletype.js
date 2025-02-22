const { parser } = require("./parser");

// Utilities
function escapeHTML(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function Text(...elements) {
  return elements
    .flat()
    .map((el) => {
      if (el && typeof el === "object" && el.type === "component") {
        return el.render();
      } else if (typeof el === "string") {
        return escapeHTML(el);
      }
      return String(el);
    })
    .join("");
}

function createComponent(renderFunction) {
  return { type: "component", render: renderFunction };
}

function Render(...children) {
  return Text(...children);
}

function Row(...children) {
  return createComponent(() => Text(...children, Space()));
}

function Space(count = 1) {
  return createComponent(() => "\n".repeat(count));
}

// Telegram HTML components
function toBold(string) {
  return `<b>${string}</b>`;
}
function Bold(...children) {
  return createComponent(() => toBold(Text(...children)));
}
function toItalic(string) {
  return `<i>${string}</i>`;
}
function Italic(...children) {
  return createComponent(() => toItalic(Text(...children)));
}

function toUnderline(string) {
  return `<u>${string}</u>`;
}

function Underline(...children) {
  return createComponent(() => toUnderline(Text(...children)));
}

function toStrike(string) {
  return `<s>${string}</s>`;
}

function Strike(...children) {
  return createComponent(() => toStrike(Text(...children)));
}

function toSpoiler(string) {
  return `<tg-spoiler>${string}</tg-spoiler>`;
}

function Spoiler(...children) {
  return createComponent(() => toSpoiler(Text(...children)));
}

function Link(href, ...children) {
  return createComponent(
    () => `<a href="${escapeHTML(href)}">${Text(...children)}</a>`
  );
}

function toCode(string) {
  return `<code>${string}</code>`;
}

function Code(...children) {
  return createComponent(() => toCode(Text(...children)));
}

function toPre(string) {
  return `<pre>${string}</pre>`;
}

function Pre(code, lang = "") {
  if (lang) {
    const codeOutput = toCode(escapeHTML(code));
    const codeWithClass = codeOutput.replace(
      "<code>",
      `<code class="language-${lang}" >`
    );
    return createComponent(() => toPre(codeWithClass));
  }

  return createComponent(() => toPre(escapeHTML(code)));
}

function toQuote(string) {
  return `<blockquote>${string}</blockquote>`;
}

function Quote(...children) {
  return createComponent(() => toQuote(Text(...children)));
}

function toEmoji(id, fallback = "") {
  return `<tg-emoji emoji-id="${id}">${fallback}</tg-emoji>`;
}

function Emoji(id, fallback = "") {
  return createComponent(() => toEmoji(id, escapeHTML(fallback)));
}

function mapper(nodes) {
  return nodes.map((node) => {
    if (node.type === "text") return node.content;
    const children = mapper(node.children);
    const tag = node.tag.toLowerCase();
    switch (tag) {
      case "b":
      case "strong":
        return Bold(...children);
      case "i":
      case "em":
        return Italic(...children);
      case "u":
      case "ins":
        return Underline(...children);
      case "s":
      case "strike":
      case "del":
        return Strike(...children);
      case "span":
        return node.attributes.class === "tg-spoiler"
          ? Spoiler(...children)
          : Text(...children);
      case "tg-spoiler":
        return Spoiler(...children);
      case "a":
        return Link(node.attributes.href, ...children);
      case "tg-emoji":
        return Emoji(node.attributes["emoji-id"], children[0] || "");
      case "code":
        return Code(...children);
      case "pre":
        if (
          node.children.length === 1 &&
          node.children[0].type === "tag" &&
          node.children[0].tag.toLowerCase() === "code"
        ) {
          const codeTag = node.children[0];
          let lang = "";
          if (
            codeTag.attributes.class &&
            codeTag.attributes.class.startsWith("language-")
          )
            lang = codeTag.attributes.class.slice("language-".length);
          const codeContent = mapper(codeTag.children).join("");
          return Pre(codeContent, lang);
        }
        return createComponent(() => toPre(Text(...children)));
      case "blockquote":
        return Quote(...children);
      default:
        return Text(...children);
    }
  });
}

class MessageBuilder {
  constructor(message = "") {
    this.message = message;
  }

  row(...text) {
    const prettyText = text.map((t) => t.trim()).join(" ");
    const parsed = parser(prettyText);
    const mapped = mapper(parsed);
    const component = Row(this.message, ...mapped, Space());
    return new MessageBuilder(component);
  }

  space(count = 1) {
    const message = Row(this.message, Space(count));
    return new MessageBuilder(message);
  }

  render() {
    return Render(this.message);
  }
}

module.exports = {
  Render,
  Text,
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
  Space,
  MessageBuilder,
};
