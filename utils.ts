import { ChatP, Message, MessageEntity } from "mtkruto/mod.ts";

export function getMessageSenderName(message: Message) {
  if (message.from) {
    return ((message.from.firstName || "") + " " +
      (message.from.lastName || "")).trim();
  } else if (message.senderChat) {
    if (
      "title" in message.senderChat && message.senderChat.id != message.chat.id
    ) {
      return message.senderChat.title;
    }
  } else if (message.chat.type == "channel") {
    return message.chat.title;
  }
  return null;
}

export function getMessageDate({ date }: Message, time = false) {
  const now = Date.now();
  const diff = now - date.getTime();
  if (time || diff <= 86_340_000) { // less than 24 hours
    return date.getHours().toString().padStart(2, "0") + ":" +
      date.getMinutes().toString().padStart(2, "0");
  } else if (diff <= 514_800_000) { // less than about a week
    return {
      0: "Sun",
      1: "Mon",
      2: "Tue",
      3: "Wed",
      4: "Thu",
      5: "Fri",
      6: "Sat",
    }[date.getDay()];
  } else {
    return date.getMonth().toString() + "/" + date.getDate().toString() + "/" +
      (date.getFullYear() - 2000).toString();
  }
}

export function getChatTitle(chat: ChatP) {
  if ("title" in chat) {
    return chat.title;
  } else {
    return ((chat.firstName || "") + " " + (chat.lastName || "")).trim();
  }
}

export function escape(s: string) {
  s = s.replace(/&/g, "&amp;");
  s = s.replace(/</g, "&lt;");
  s = s.replace(/>/g, "&gt;");
  s = s.replace(/"/g, "&quot;");
  s = s.replace(/\'/g, "&#x27;");
  return s;
}

export function unparse(
  text: string,
  entities: MessageEntity[],
  offset = 0,
  length?: number,
): string {
  if (!text) return text;
  else if (entities.length == 0) return escape(text);

  length = length ?? text.length;

  const html = [];
  let lastOffset = 0;

  for (let i = 0; i < entities.length; i++) {
    const entity = entities[i];

    if (entity.offset >= offset + length) break;

    const relativeOffset = entity.offset - offset;

    if (relativeOffset > lastOffset) {
      html.push(escape(text.slice(lastOffset, relativeOffset)));
    } else if (relativeOffset < lastOffset) continue;

    let skipEntity = false;
    const length_ = entity.length;
    const text_ = unparse(
      text.slice(relativeOffset, relativeOffset + length_),
      entities.slice(i + 1, entities.length),
      entity.offset,
      length_,
    );

    switch (entity.type) {
      case "bold":
        html.push(`<b>${text_}</b>`);
        break;
      case "italic":
        html.push(`<i>${text_}</i>`);
        break;
      case "underline":
        html.push(`<u>${text_}</u>`);
        break;
      case "strikethrough":
        html.push(`<s>${text_}</s>`);
        break;
      case "textLink":
        html.push(`<a href="${entity.url}">${text_}</a>`);
        break;
      case "textMention":
        html.push(`<a href="tg://user?id=${entity.userId}">${text_}</a>`);
        break;
      case "spoiler":
        html.push(`<span class="tg-spoiler">${text_}</span>`);
        break;
      case "code":
        html.push(`<code>${text_}</code>`);
        break;
      case "pre":
        html.push(
          `<pre${
            entity.language && ` class="${entity.language}"`
          }>${text_}</pre>`,
        );
        break;
      default:
        skipEntity = true;
    }

    lastOffset = relativeOffset + (skipEntity ? 0 : length_);
  }

  html.push(escape(text.slice(lastOffset, text.length)));

  return html.join("");
}
