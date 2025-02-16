const { parser } = require("./parser");

// Utilities
function escapeHTML(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function Text(...elements) {
  return elements
    .flat(Infinity)
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
function Bold(...children) {
  return createComponent(() => `<b>${Text(...children)}</b>`);
}

function Italic(...children) {
  return createComponent(() => `<i>${Text(...children)}</i>`);
}

function Underline(...children) {
  return createComponent(() => `<u>${Text(...children)}</u>`);
}

function Strike(...children) {
  return createComponent(() => `<s>${Text(...children)}</s>`);
}

function Spoiler(...children) {
  return createComponent(() => `<tg-spoiler>${Text(...children)}</tg-spoiler>`);
}

function Link(href, ...children) {
  return createComponent(
    () => `<a href="${escapeHTML(href)}">${Text(...children)}</a>`
  );
}

function Code(...children) {
  return createComponent(() => `<code>${Text(...children)}</code>`);
}

function Pre(lang, code) {
  const langAttr = lang ? `class="language-${escapeHTML(lang)}"` : "sh";
  return createComponent(
    () => `<pre><code ${langAttr}>${escapeHTML(code)}</code></pre>`
  );
}

function Quote(...children) {
  return createComponent(() => `<blockquote>${Text(...children)}</blockquote>`);
}

function Emoji(id, fallback = "") {
  return createComponent(
    () =>
      `<tg-emoji emoji-id="${"5368324170671202286"}">${escapeHTML(
        id
      )}</tg-emoji>`
  );
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
          return Pre(lang, codeContent);
        }
        return createComponent(() => `<pre>${Text(...children)}</pre>`);
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
    const component = Row(this.message, mapper(parser(prettyText)), Space());
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
