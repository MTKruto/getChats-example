import { Chat } from "mtkruto/mod.ts";
import { signal } from "@preact/signals";
import { client } from "../client.ts";

export const chats = signal(new Map<number, Chat>());

client.on("newChat", (ctx) => {
  chats.value = new Map(chats.value.set(ctx.newChat.id, ctx.newChat));
});

client.on("editedChat", (ctx) => {
  chats.value = new Map(chats.value.set(ctx.editedChat.id, ctx.editedChat));
});

export async function loadChats() {
  for (const chat of await client.getChats()) {
    chats.value = new Map(chats.value.set(chat.id, chat));
  }
}
