# TeleType

A pure JavaScript library for generating Telegram HTML markup without dependencies.

## 📋 Table of Contents
- [Overview](#-overview)
- [Why TeleType?](#-why-teletype)
- [Installation](#-installation)
- [Usage](#-usage)
- [Features](#️-features)
- [API Reference](#-api-reference)
- [Contributing](#-contributing)
- [License](#-license)

## 📖 Overview
`teletype` helps you create properly formatted Telegram HTML messages with ease, using a fluent builder pattern. The library handles HTML parsing and rendering, making it safe and convenient to create complex formatted messages.

## 🤔 Why TeleType?
- **Zero Dependencies**: Lightweight and pure JavaScript implementation
- **Type-Safe**: Built with TypeScript for better developer experience (not yet)
- **Framework Agnostic**: `teletype` is designed to be framework-agnostic, meaning it works with:
  - Any Telegram bot framework (grammY, node-telegram-bot-api, Telegraf, etc.)
  - Any JavaScript/TypeScript project
  - Both Node.js and browser environments
  - Any message sending implementation
- **Safe HTML**: Automatic escaping and validation of HTML markup
- **Fluent API**: Intuitive builder pattern for message construction

Writing formatted messages for Telegram can be messy. Compare these approaches:

### Traditional way:
```javascript
// Using string concatenation - hard to read and maintain
message.text += "\n\n<i>Processing your request...</i>\n";
message.text += "<b>Status:</b> " + status + "\n";
message.text += "-------------------\n";
// Using template literal - better, but still cluttered with HTML tags
message.text = <b>Welcome!</b><i>Your order details:</i>Price: <code>${price}</code>Status: <i>${status}</i><u>Note:</u> Delivery tomorrow;
```

### With TeleType:
```javascript
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
.row("Price: <code>" + price + "</code>")
.row("Status:", `<i>${status}</i>`)
.row("<u>Note:</u> Delivery tomorrow")
.render();
```
#### Key benefits:
- Write text naturally with proper line breaks using `.row()`
- Automatic spacing between elements in rows
- Clean builder pattern approach
- Built-in HTML parsing
- Maintainable code structure

## 🚀 Installation
```bash
npm install teletype
```

## 💡 Usage

### 1. Using MessageBuilder (Recommended)
```javascript
const { MessageBuilder } = require('teletype');

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
```javascript
const { 
  Render, Text, Bold, Italic, Underline, 
  Strike, Link, Code, Pre, Quote, Row, Space 
} = require('teletype');

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
```javascript
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

## 🔧 API Reference

### MessageBuilder
- `.row(...elements)`: Add a row of text/elements
- `.space(count = 1)`: Add line breaks
- `.render()`: Convert to final HTML string

### Supported HTML Tags

## 📚 Primitives with Examples
### `Bold(...children)`
Returns bold text.
```javascript
Bold('Important') // <b>Important</b>
```
### `Italic(...children)`
Returns italic text.
```javascript
Italic('Notice') // <i>Notice</i>
```
### `Underline(...children)`
Returns underlined text.
```javascript
Underline('Highlighted') // <u>Highlighted</u>
```
### `Strike(...children)`
Returns strikethrough text.
```javascript
Strike('Deprecated') // <s>Deprecated</s>
```
### `Link(href, ...children)`
Returns a clickable link.
```javascript
Link('Open Google', 'https://google.com') // <a href="https://google.com">Open Google</a>
```
### `Emoji(id, fallback)`
Returns a Telegram emoji.
```javascript
Emoji('1F609', '😉') // <tg-emoji emoji-id="1F609">😉</tg-emoji>
```
### `Quote(...children)`
Returns blockquoted text.
```javascript
Quote('Famous quote') // <blockquote>Famous quote</blockquote>
```
### `Pre(lang, code)`
Returns preformatted code block.
```javascript
Pre('javascript', 'console.log("Hello")')
// <pre><code class="language-javascript">console.log("Hello")</code></pre>
```
### `Space(count = 1)`
Adds line breaks.
```javascript
Space(2) // "\n\n"
```
### `Row(...children)`
Returns a horizontal layout.
```javascript
Row(Bold('Part 1'), Italic('Part 2'))
// "<b>Part 1</b><i>Part 2</i>"
```

## ⚠️ Handling Long Messages (In Progress)
`teletype` provides strategies to handle Telegram's 4096-character message limit:
- `truncate`: Cuts off text at 4096 characters.
- `split`: Splits into multiple messages.
- `toFile`: Saves the message as a text file.
- `filter`: Removes redundant parts (e.g., stack traces).

### Example:
```javascript
const longMessage = "...";
const parts = teletype.splitMessage(longMessage);
parts.forEach(part => sendToTelegram(part));
```

## 💻 Contributing
Contributions are welcome! Feel free to fork the repository and submit pull requests.

## 📜 License
This project is licensed under the MIT License.
