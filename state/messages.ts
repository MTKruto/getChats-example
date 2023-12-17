import { Chat, Message } from "mtkruto/mod.ts";
import { signal } from "@preact/signals";
import { client } from "../client.ts";
import { downloadChatPhoto } from "./chats.ts";

const openChat = signal<number | null>(null);

let allLoaded = false;
export const chat = signal<Chat | null>(null);
export const messages = signal(new Array<Message>());

function clearMessages() {
  allLoaded = false;
  messages.value = [];
}
async function setOpenChat(chatId: number) {
  if (openChat.value != chatId) {
    clearMessages();
    openChat.value = chatId;
    clearMessages();
    chat.value = await client.getChat(chatId);
    downloadChatPhoto(chatId);
  }
}

export async function loadMessages(chatId: number) {
  await setOpenChat(chatId);
  if (allLoaded) {
    return;
  }
  const limit = 100;
  const after = messages.value[messages.value.length - 1];
  const messages_ = await client.getHistory(chatId, { limit, after });
  if (messages_.length < limit) {
    allLoaded = true;
  }
  messages.value = messages.value.concat(messages_);
}

client.on("message", (ctx) => {
  if (ctx.chat.id == openChat.value) {
    messages.value = ([ctx.message] as Message[]).concat(messages.value);
  }
});

client.on("editedMessage", (ctx) => {
  if (ctx.chat.id == openChat.value) {
    messages.value = messages.value.map((v) =>
      v.id == ctx.editedMessage.id ? ctx.editedMessage : v
    );
  }
});

client.on("deletedMessages", (ctx) => {
  for (const message of ctx.deletedMessages) {
    if (message.chat.id == openChat.value) {
      messages.value = messages.value.filter((v) => v.id != message.id);
    }
  }
});
