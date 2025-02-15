// Utilities
function escapeHTML(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
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
  const langAttr = lang ? ` class="language-${escapeHTML(lang)}"` : "sh";
  return createComponent(
    () => `<pre><code${langAttr}>${escapeHTML(code)}</code></pre>`
  );
}

function Quote(...children) {
  return createComponent(() => `<blockquote>${Text(...children)}</blockquote>`);
}

function Emoji(id, fallback) {
  return createComponent(
    () =>
      `<tg-emoji emoji-id="${"5368324170671202286"}">${escapeHTML(
        id
      )}</tg-emoji>`
  );
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
};
