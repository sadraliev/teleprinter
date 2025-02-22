function parser(markupText) {
  const supportedTags = new Set([
    "b",
    "strong",
    "i",
    "em",
    "u",
    "ins",
    "s",
    "strike",
    "del",
    "span",
    "tg-spoiler",
    "a",
    "tg-emoji",
    "code",
    "pre",
    "blockquote",
  ]);

  function parseNodes(markupText, startIndex = 0, stopTag = null) {
    let index = startIndex;
    const nodes = [];

    while (index < markupText.length) {
      if (markupText[index] === "<") {
        if (markupText.startsWith("</", index)) {
          const closeIndex = markupText.indexOf(">", index);
          if (closeIndex === -1) break;

          const tagName = markupText.slice(index + 2, closeIndex).trim();
          if (stopTag && tagName === stopTag) {
            return { nodes, newIndex: closeIndex + 1 };
          }

          nodes.push({ type: "text", content: `</${tagName}>` });
          index = closeIndex + 1;
          continue;
        } else {
          const closeIndex = markupText.indexOf(">", index);
          if (closeIndex === -1) break;

          const tagContent = markupText.slice(index + 1, closeIndex).trim();
          const { tagName, attributes, isSelfClosing } = parseTag(tagContent);

          // Single tags (<hr/>, <img/>) should be saved as text without duplication
          if (isSelfClosing || markupText[closeIndex - 1] === "/") {
            nodes.push({ type: "text", content: `<${tagContent}>` });
            index = closeIndex + 1;
            continue;
          }

          // If the tag is not supported, but may contain nested elements
          if (!supportedTags.has(tagName)) {
            const result = parseNodes(markupText, closeIndex + 1, tagName);

            const hasSupportedChildren = result.nodes.some(
              (node) => node.type === "tag"
            );

            if (hasSupportedChildren) {
              nodes.push({ type: "text", content: `<${tagContent}>` });
              nodes.push(...result.nodes);
              nodes.push({ type: "text", content: `</${tagName}>` });
            } else {
              nodes.push({
                type: "text",
                content: `<${tagContent}>${markupText.slice(
                  closeIndex + 1,
                  result.newIndex
                )}</${tagName}>`,
              });
            }

            index = result.newIndex;
            continue;
          }

          // Supported tag
          const result = parseNodes(markupText, closeIndex + 1, tagName);
          nodes.push({
            type: "tag",
            tag: tagName,
            attributes,
            children: result.nodes,
          });
          index = result.newIndex;
        }
      } else {
        const textEnd = markupText.indexOf("<", index);
        const text =
          textEnd === -1
            ? markupText.slice(index)
            : markupText.slice(index, textEnd);
        if (text.trim()) nodes.push({ type: "text", content: text });
        index = textEnd === -1 ? markupText.length : textEnd;
      }
    }
    return { nodes, newIndex: index };
  }

  function parseTag(tagContent) {
    const firstSpace = tagContent.indexOf(" ");
    let tagName = tagContent;
    let attrString = "";
    let isSelfClosing = false;

    if (firstSpace !== -1) {
      tagName = tagContent.slice(0, firstSpace);
      attrString = tagContent.slice(firstSpace + 1);
    }

    // Check if the tag ends with "/"
    if (attrString.endsWith("/")) {
      isSelfClosing = true;
      attrString = attrString.slice(0, -1).trim();
    }

    const attributes = {};
    const attrRegex = /([a-zA-Z\-]+)="([^"]*)"/g;
    let match;
    while ((match = attrRegex.exec(attrString)) !== null) {
      attributes[match[1]] = match[2];
    }

    return { tagName, attributes, isSelfClosing };
  }

  return parseNodes(markupText).nodes;
}

module.exports = { parser };
