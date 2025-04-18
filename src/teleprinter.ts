import { ComponentFactory, type TComponentFactory } from "./components";
import { parser } from "./parser";

interface Component {
  type: "component";
  render: () => string;
}

// Utilities
export function escapeHTML(text: string): string {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function Text(...elements: (string | Component)[]): string {
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

export function createComponent(renderFunction: () => string): Component {
  return { type: "component", render: renderFunction };
}

export function Render(...children: (string | Component)[]): string {
  return Text(...children);
}

export function Row(...children: (string | Component)[]): Component {
  return createComponent(() => {
    // Join children with spaces and add a newline at the end
    return (
      children
        .map((child) => (typeof child === "string" ? child : child.render()))
        .join(" ") + "\n"
    );
  });
}

export function Space(count = 1): Component {
  return createComponent(() => "\n".repeat(count));
}

// Telegram HTML components
export function toBold(string: string): string {
  return `<b>${string}</b>`;
}

export function Bold(...children: (string | Component)[]): Component {
  return createComponent(() => toBold(Text(...children)));
}

export function toItalic(string: string): string {
  return `<i>${string}</i>`;
}

export function Italic(...children: (string | Component)[]): Component {
  return createComponent(() => toItalic(Text(...children)));
}

export function toUnderline(string: string): string {
  return `<u>${string}</u>`;
}

export function Underline(...children: (string | Component)[]): Component {
  return createComponent(() => toUnderline(Text(...children)));
}

export function toStrike(string: string): string {
  return `<s>${string}</s>`;
}

export function Strike(...children: (string | Component)[]): Component {
  return createComponent(() => toStrike(Text(...children)));
}

export function toSpoiler(string: string): string {
  return `<tg-spoiler>${string}</tg-spoiler>`;
}

export function Spoiler(...children: (string | Component)[]): Component {
  return createComponent(() => toSpoiler(Text(...children)));
}

export function Link(
  href: string,
  ...children: (string | Component)[]
): Component {
  return createComponent(
    () => `<a href="${escapeHTML(href)}">${Text(...children)}</a>`
  );
}

export function toCode(string: string): string {
  return `<code>${string}</code>`;
}

export function Code(...children: (string | Component)[]): Component {
  return createComponent(() => toCode(Text(...children)));
}

export function toPre(string: string): string {
  return `<pre>${string}</pre>`;
}

export function Pre(code: string, lang = ""): Component {
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

export function toBlockquote(string: string): string {
  return `<blockquote>${string}</blockquote>`;
}

export function Blockquote(...children: (string | Component)[]): Component {
  return createComponent(() => toBlockquote(Text(...children)));
}

export function toEmoji(id: string, fallback = ""): string {
  return `<tg-emoji emoji-id="${id}">${fallback}</tg-emoji>`;
}

export function Emoji(id: string, fallback = ""): Component {
  return createComponent(() => toEmoji(id, escapeHTML(fallback)));
}

export function mapper(nodes: any[]): (string | Component)[] {
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
        return Blockquote(...children);
      default:
        return Text(...children);
    }
  });
}

export type MessageBuilder = {
  message: string | Component;
  row: (
    ...text: (string | ((components: TComponentFactory) => MessageBuilder))[]
  ) => MessageBuilder;
  render: () => string;
  debug: () => void;
};

export function MessageBuilder(
  message: string | Component = ""
): MessageBuilder {
  return {
    message,
    row: (
      ...text: (string | ((components: TComponentFactory) => MessageBuilder))[]
    ) => {
      const prettyText = text
        .map((t) => {
          if (typeof t === "function") {
            const component = ComponentFactory();
            const messageBuilder = t(component);
            return messageBuilder.render();
          }
          return t.trim();
        })
        .join(" ");

      const parsed = parser(prettyText);
      const mapped = mapper(parsed);
      const currentMessage = Render(message);
      const newMessage = createComponent(() => {
        if (!currentMessage) {
          return Text(...mapped) + "\n";
        }
        const cleanCurrentMessage = currentMessage.replace(/\n*$/, "");
        return cleanCurrentMessage + "\n" + Text(...mapped) + "\n";
      });
      return MessageBuilder(newMessage);
    },
    render: () => Render(message),
    debug: () => console.log(message),
  };
}
