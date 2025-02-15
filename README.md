# markgram

A pure JavaScript library for generating Telegram HTML markup without dependencies.

## 📖 Overview
`markgram` helps you create properly formatted Telegram HTML messages with ease. The library includes components like bold, italic, links, preformatted text, and more, with built-in handling for the 4096-character limit.

## 🚀 Installation
```bash
npm install markgram
```

## 💡 Usage
```javascript
const { 
  Layout, Text, Space, Bold, Italic, Underline, Strike, 
  Spoiler, Link, Code, Pre, Quote, Emoji, Row
} = require('markgram');

const message = Layout(
  Row(Quote(
    "🚨 Spoiler inside quote:\n",
    Spoiler("Hidden information!")
  )),
  Row(
    Bold('Hello'),
    Italic('world!'),
    Link('Check this out', 'https://example.com')
  ),
  Row(Space()),
  Row(Underline('Underlined text')),
  Row(Strike('Strikethrough text')),
  Row(
    Emoji('1F60D', '😍'),
    Code('const x = 10;')
  ),
  Row(Pre('javascript', 'function hello() { return "world"; }'))
);

```

## ⚙️ Features
- ✅ Simple component-based API (Bold, Italic, Underline, Strike, Link, Code, Pre, Quote, Emoji, Spoiler, LineBreak, Space)
- ✅ HTML escaping to prevent invalid Telegram markup
- ✅ Layout components (Layout, Row, Space)
- ✅ Handles 4096-character message limits with configurable strategies:
  - Truncate
  - Split into multiple messages
  - Export to file
  - Remove unnecessary parts (e.g., stack traces)

## 📚 API Reference with Examples
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

## ⚠️ Handling Long Messages
`markgram` provides strategies to handle Telegram's 4096-character message limit:
- `truncate`: Cuts off text at 4096 characters.
- `split`: Splits into multiple messages.
- `toFile`: Saves the message as a text file.
- `filter`: Removes redundant parts (e.g., stack traces).

### Example:
```javascript
const longMessage = "...";
const parts = markgram.splitMessage(longMessage);
parts.forEach(part => sendToTelegram(part));
```

## 💻 Contributing
Contributions are welcome! Feel free to fork the repository and submit pull requests.

## 📜 License
This project is licensed under the MIT License.
