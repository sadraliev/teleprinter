function parser(html) {
  let index = 0;

  // Recursively parse nodes until an optional stop tag is reached
  function parseNodes(stopTag = null) {
    const nodes = [];

    while (index < html.length) {
      if (html[index] === "<") {
        // Check if this is a closing tag
        if (html.startsWith("</", index)) {
          const closeIndex = html.indexOf(">", index);
          if (closeIndex === -1) break; // malformed tag
          const tagName = html.slice(index + 2, closeIndex).trim();
          // If this closing tag matches the expected stopTag, consume it and return
          if (stopTag && tagName === stopTag) {
            index = closeIndex + 1;
            return nodes;
          } else {
            // If it's an unexpected closing tag, skip it
            index = closeIndex + 1;
            continue;
          }
        } else {
          // We found an opening tag
          const closeIndex = html.indexOf(">", index);
          if (closeIndex === -1) break; // malformed tag
          const tagContent = html.slice(index + 1, closeIndex).trim();

          // Separate the tag name from its attributes
          const firstSpace = tagContent.indexOf(" ");
          let tagName,
            attrString = "";
          if (firstSpace !== -1) {
            tagName = tagContent.slice(0, firstSpace);
            attrString = tagContent.slice(firstSpace + 1);
          } else {
            tagName = tagContent;
          }

          // Parse attributes from the attribute string using a simple regex
          const attrs = {};
          const attrRegex = /([a-zA-Z\-]+)="([^"]*)"/g;
          let attrMatch;
          while ((attrMatch = attrRegex.exec(attrString)) !== null) {
            attrs[attrMatch[1]] = attrMatch[2];
          }

          // Advance index past the closing ">" of the opening tag
          index = closeIndex + 1;

          // Recursively parse the children nodes until the matching closing tag is found
          const children = parseNodes(tagName);
          nodes.push({
            type: "tag",
            tag: tagName,
            attributes: attrs,
            children: children,
          });
        }
      } else {
        // Plain text: gather characters until the next "<"
        const nextTagPos = html.indexOf("<", index);
        let text;
        if (nextTagPos === -1) {
          text = html.slice(index);
          index = html.length;
        } else {
          text = html.slice(index, nextTagPos);
          index = nextTagPos;
        }
        // Add text node only if there's non-empty content (preserving whitespace if needed)
        if (text) {
          nodes.push({
            type: "text",
            content: text,
          });
        }
      }
    }
    return nodes;
  }

  return parseNodes();
}

module.exports = { parser };
