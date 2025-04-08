# TelePrinter

## 📖 Overview
`teleprinter` helps you create properly formatted Telegram HTML messages with ease, using a fluent builder pattern. The library handles HTML parsing and rendering, making it safe and convenient to create complex formatted messages.

## 📋 Table of Contents
- [Overview](#-overview)
- [Why TelePrinter?](#-why-teleprinter)
- [Installation](#-installation)
- [Usage](#-usage)
- [Features](#️-features)
- [API Reference](#-api-reference)
- [Contributing](#-contributing)
- [License](#-license)


## 🤔 Why TelePrinter?
- **Zero Dependencies**: Lightweight and pure TypeScript implementation
- **Type-Safe**: Built with TypeScript for better developer experience
- **Framework Agnostic**: `teleprinter` is designed to be framework-agnostic, meaning it works with:
  - Any Telegram bot framework (grammY, node-telegram-bot-api, Telegraf, etc.)
  - Any JavaScript/TypeScript project
  - Both Node.js and browser environments
  - Any message sending implementation
- **Safe HTML**: Automatic escaping and validation of HTML markup
- **Fluent API**: Intuitive builder pattern for message construction
  
#### Key benefits:
- Write text naturally with proper line breaks using `.row()`
- Automatic spacing between elements in rows
- Clean builder pattern approach
- Built-in HTML parsing
- Maintainable code structure
- Full TypeScript support with type definitions

Writing formatted messages for Telegram can be messy. Compare these approaches:

### Traditional way:
```typescript
// Using string concatenation - hard to read and maintain
message.text += "\n\n<i>Processing your request...</i>\n";
message.text += "<b>Status:</b> " + status + "\n";
message.text += "-------------------\n";
// Using template literal - better, but still cluttered with HTML tags
message.text = <b>Welcome!</b><i>Your order details:</i>Price: <code>${price}</code>Status: <i>${status}</i><u>Note:</u> Delivery tomorrow;
// Manually escaping special characters
message.text += "Greetings, human! I am a &quot;friendly&quot; bot.<br>";
message.text += "I enjoy solving your &lt;problems&gt; and ensuring you have &quot;fun&quot; with technology.<br>";
message.text += "But let&apos;s be honest, it&apos;s &lt;not&gt; so &quot;fun&quot; to keep escaping these &lt;characters&gt;. It&apos;s like trying to &lt;code&gt; while juggling cats.<br>";
```

### With TelePrinter:
```typescript
// Clean, readable, and maintainable
const message = new MessageBuilder()
.row("<i>Processing your request...</i>")
.row("<b>Status:</b>", status) // Automatically adds whitespace between elements
.row("-------------------")
.render();
// Complex formatting becomes simple
const message = new MessageBuilder()
.row("<b>Welcome!</b>")
.row("<i>Your order details:</i>")
.row("Price: <code>", price, "</code>")
.row("Status:", `<i>${status}</i>`)
.row("<u>Note:</u> Delivery tomorrow")
.render();
// Clear and expressive
const message = new MessageBuilder()
  .row("Greetings, human! I am a \"friendly\" bot.")
  .row("I enjoy solving your  and ensuring you have \"fun\" with technology.")
  .row("No need for annoying escapes—this feels more like coding, and less like herding cats.")
  .render();
```

## 🚀 Installation
```bash
npm install teleprinter
```

## ⚙️ Features
- ✅ Fluent builder pattern for message construction
- ✅ Safe HTML parsing and escaping
- ✅ Support for all Telegram HTML tags:
  - Bold (`<b>`, `<strong>`)
  - Italic (`<i>`, `<em>`)
  - Underline (`<u>`, `<ins>`)
  - Strikethrough (`<s>`, `<strike>`, `<del>`)
  - Spoiler (`<span class="tg-spoiler">`)
  - Links (`<a href="...">`)
  - Code blocks (`<pre>`, `<code>`)
  - Blockquotes (`<blockquote>`)
  - Custom emoji (`<tg-emoji>`)
- ✅ Automatic line breaks and spacing
- ✅ Raw HTML support with proper escaping
- ✅ Full TypeScript support with type definitions
  
## 💡 Usage

### 1. Using MessageBuilder (Recommended)
```typescript
import { MessageBuilder } from 'teleprinter';

// Works with any Telegram bot framework
const message = new MessageBuilder()
  .row("👋 Welcome to Telegram!")
  .space()
  .row("<b>Bold text</b> and <i>italic text</i>")
  .row("Multiple", "arguments", "are joined", "with spaces")
  .space(2)  // Add multiple line breaks
  .render();

// Use with grammY
bot.api.sendMessage(chat.id, message, { parse_mode: "HTML" });

// Or with node-telegram-bot-api
bot.sendMessage(chatId, message, { parse_mode: "HTML" });

// Or with Telegraf
ctx.reply(message, { parse_mode: "HTML" });
```

### 2. Using Primitives (like JSX)
```typescript
import { 
  Render, Text, Bold, Italic, Underline, 
  Strike, Link, Code, Pre, Quote, Row, Space 
} from 'teleprinter';

const message = Render(
  Row(
    Bold("Welcome"), 
    "to", 
    Italic("Telegram")
  ),
  Space(),
  Row(
    "Check out this ", 
    Link("https://example.com", "link"), 
    "!"
  ),
  Space(),
  Row(
    Quote(
      "With primitives you can",
      Space(),
      Bold("compose"), " and ", Italic("nest"),
      Space(),
      "elements programmatically"
    )
  ),
  Row(
    Pre("javascript", 
      'console.log("Hello World!");'
    )
  )
);

bot.api.sendMessage(chat.id, message, { parse_mode: "HTML" });
```

Both approaches produce properly formatted HTML messages, but:
- `MessageBuilder` is more convenient for simple linear messages
- Primitives offer more control for complex nested structures and programmatic message generation

### Complex Formatting Example
```typescript
const message = new MessageBuilder()
  .row("Here's a message with various formatting:")
  .space()
  .row(
    "Mix of <b>bold</b>, <i>italic</i>, and <u>underlined</u> text",
    "in the same row"
  )
  .space()
  .row(
    'Links: <a href="https://example.com">Click here</a>',
    'And <span class="tg-spoiler">hidden spoilers</span>'
  )
  .space()
  .row(
    '<pre><code class="language-python">',
    "def hello():",
    '    print("Hello, World!")',
    "</code></pre>"
  )
  .render();
```

## 🔧 API Reference

### MessageBuilder
- `.row(...elements: string[])`: Add a row of text/elements
- `.space(count = 1)`: Add line breaks
- `.render()`: Convert to final HTML string

### Supported HTML Tags

## 📚 Primitives with Examples
### `Bold(...children: (string | Component)[])`
Returns bold text.
```typescript
Bold('Important') // <b>Important</b>
```
### `Italic(...children: (string | Component)[])`
Returns italic text.
```typescript
Italic('Notice') // <i>Notice</i>
```
### `Underline(...children: (string | Component)[])`
Returns underlined text.
```typescript
Underline('Highlighted') // <u>Highlighted</u>
```
### `Strike(...children: (string | Component)[])`
Returns strikethrough text.
```typescript
Strike('Deprecated') // <s>Deprecated</s>
```
### `Link(href: string, ...children: (string | Component)[])`
Returns a clickable link.
```typescript
Link('https://google.com', 'Open Google') // <a href="https://google.com">Open Google</a>
```
### `Emoji(id: string, fallback: string)`
Returns a Telegram emoji.
```typescript
Emoji('1F609', '😉') // <tg-emoji emoji-id="1F609">😉</tg-emoji>
```
### `Quote(...children: (string | Component)[])`
Returns blockquoted text.
```typescript
Quote('Famous quote') // <blockquote>Famous quote</blockquote>
```
### `Pre(code: string, lang?: string)`
Returns preformatted code block.
```typescript
Pre('console.log("Hello")', 'javascript')
// <pre><code class="language-javascript">console.log("Hello")</code></pre>
```
### `Space(count = 1)`
Adds line breaks.
```typescript
Space(2) // "\n\n"
```
### `Row(...children: (string | Component)[])`
Returns a horizontal layout.
```typescript
Row(Bold('Part 1'), Italic('Part 2'))
// "<b>Part 1</b><i>Part 2</i>"
```

## ⚠️ Handling Long Messages (In Progress)
`teleprinter` provides strategies to handle Telegram's 4096-character message limit:
- `truncate`: Cuts off text at 4096 characters.
- `split`: Splits into multiple messages.
- `toFile`: Saves the message as a text file.
- `filter`: Removes redundant parts (e.g., stack traces).

### Example:
```typescript
const longMessage = "...";
const parts = teleprinter.splitMessage(longMessage);
parts.forEach(part => sendToTelegram(part));
```

## 💻 Contributing
Contributions are welcome! Feel free to fork the repository and submit pull requests.

## 📜 License
This project is licensed under the MIT License.
