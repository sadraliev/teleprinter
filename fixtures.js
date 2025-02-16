const textWithTags = `

Here's a creative text using the provided HTML tags:

Welcome to the Magical World of Code and Dreams!

In this enchanted realm, <strong>bold</strong> and <b>bold</b> wizards cast their spells with precision. Meanwhile, <i>italic</i> and <em>italic</em> fairies dance under the moonlight, their whispers weaving a tapestry of mystery.

But beware, for some secrets are hidden in <u>underline</u> and <ins>underline</ins> ancient tomes, waiting to be uncovered by brave adventurers. Others, however, are <s>strikethrough</s>, <strike>strikethrough</strike>, or <del>strikethrough</del>, lost to the sands of time.

For those who dare to peek, a <span class="tg-spoiler">spoiler</span> awaits, revealing the deepest mysteries of the universe. Yet, even the bravest must be cautious, for some truths are wrapped in <b>bold <i>italic bold <s>italic bold strikethrough <span class="tg-spoiler">italic bold strikethrough spoiler</span></s> <u>underline italic bold</u></i> bold</b>.

To embark on this journey, follow the <a href="http://www.example.com/">path of discovery</a>, and don't forget to mention your fellow traveler <a href="tg://user?id=123456789">@Friend</a> along the way. When you reach the end, give a thumbs up with a <tg-emoji emoji-id="5368324170671202286">👍</tg-emoji>.

Here's a snippet of code to guide you:

<pre><code class="language-python">
def magic_spell():
    print("Abracadabra!")
</code></pre>
And remember, the wisdom of the ages is often found in <blockquote>ancient texts</blockquote> that whisper secrets to those who listen.

Expand Your Knowledge

For those who seek more, there's an <blockquote expandable>expandable library</blockquote> filled with hidden truths and untold stories. Explore it, and you shall uncover the mysteries of the universe.

The Journey Begins

So, take your first step into this mystical world, where code and dreams entwine. May your path be lit with wonder and your heart filled with magic!
`;
const htmlText = `<b>bold</b>, <strong>bold</strong>
  <i>italic</i>, <em>italic</em>
  <u>underline</u>, <ins>underline</ins>
  <s>strikethrough</s>, <strike>strikethrough</strike>, <del>strikethrough</del>
  <span class="tg-spoiler">spoiler</span>, <tg-spoiler>spoiler</tg-spoiler>
  <b>bold <i>italic bold <s>italic bold strikethrough <span class="tg-spoiler">italic bold strikethrough spoiler</span></s> <u>underline italic bold</u></i> bold</b>
  <a href="http://www.example.com/">inline URL</a>
  <a href="tg://user?id=123456789">inline mention of a user</a>
  <tg-emoji emoji-id="5368324170671202286">👍</tg-emoji>
  <code>inline fixed-width code</code>
  <pre>pre-formatted fixed-width code block</pre>
  <pre><code class="language-python">pre-formatted fixed-width code block written in the Python programming language</code></pre>
  <blockquote>Block quotation started\nBlock quotation continued\nThe last line of the block quotation</blockquote>
  <blockquote expandable>Expandable block quotation started\nExpandable block quotation continued\nExpandable block quotation continued\nHidden by default part of the block quotation started\nExpandable block quotation continued\nThe last line of the block quotation</blockquote>`;

module.exports = { textWithTags, htmlText };
