import { parser } from "./parser";

interface Component {
  type: "component";
  render: () => string;
}

// Utilities
function escapeHTML(text: string): string {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function Text(...elements: (string | Component)[]): string {
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

function createComponent(renderFunction: () => string): Component {
  return { type: "component", render: renderFunction };
}

function Render(...children: (string | Component)[]): string {
  return Text(...children);
}

function Row(...children: (string | Component)[]): Component {
  return createComponent(() => Text(...children, Space()));
}

function Space(count = 1): Component {
  return createComponent(() => "\n".repeat(count));
}

// Telegram HTML components
function toBold(string: string): string {
  return `<b>${string}</b>`;
}

function Bold(...children: (string | Component)[]): Component {
  return createComponent(() => toBold(Text(...children)));
}

function toItalic(string: string): string {
  return `<i>${string}</i>`;
}

function Italic(...children: (string | Component)[]): Component {
  return createComponent(() => toItalic(Text(...children)));
}

function toUnderline(string: string): string {
  return `<u>${string}</u>`;
}

function Underline(...children: (string | Component)[]): Component {
  return createComponent(() => toUnderline(Text(...children)));
}

function toStrike(string: string): string {
  return `<s>${string}</s>`;
}

function Strike(...children: (string | Component)[]): Component {
  return createComponent(() => toStrike(Text(...children)));
}

function toSpoiler(string: string): string {
  return `<tg-spoiler>${string}</tg-spoiler>`;
}

function Spoiler(...children: (string | Component)[]): Component {
  return createComponent(() => toSpoiler(Text(...children)));
}

function Link(href: string, ...children: (string | Component)[]): Component {
  return createComponent(
    () => `<a href="${escapeHTML(href)}">${Text(...children)}</a>`
  );
}

function toCode(string: string): string {
  return `<code>${string}</code>`;
}

function Code(...children: (string | Component)[]): Component {
  return createComponent(() => toCode(Text(...children)));
}

function toPre(string: string): string {
  return `<pre>${string}</pre>`;
}

function Pre(code: string, lang = ""): Component {
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

function toQuote(string: string): string {
  return `<blockquote>${string}</blockquote>`;
}

function Quote(...children: (string | Component)[]): Component {
  return createComponent(() => toQuote(Text(...children)));
}

function toEmoji(id: string, fallback = ""): string {
  return `<tg-emoji emoji-id="${id}">${fallback}</tg-emoji>`;
}

function Emoji(id: string, fallback = ""): Component {
  return createComponent(() => toEmoji(id, escapeHTML(fallback)));
}

function mapper(nodes: any[]): (string | Component)[] {
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
        return Emoji(
          node.attributes["emoji-id"],
          typeof children[0] === "string" ? children[0] : ""
        );
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

export class MessageBuilder {
  private message: string | Component;

  constructor(message: string | Component = "") {
    this.message = message;
  }

  row(...text: string[]): MessageBuilder {
    const prettyText = text.map((t) => t.trim()).join(" ");
    const parsed = parser(prettyText);
    const mapped = mapper(parsed);
    const component = Row(this.message, ...mapped, Space());
    return new MessageBuilder(component);
  }

  space(count = 1): MessageBuilder {
    const message = Row(this.message, Space(count));
    return new MessageBuilder(message);
  }

  render(): string {
    return Render(this.message);
  }
}

export {
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
};
