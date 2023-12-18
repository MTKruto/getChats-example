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
