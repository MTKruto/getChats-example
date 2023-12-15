import { Chat } from "mtkruto/mod.ts";
import { signal } from "@preact/signals";
import { client } from "../client.ts";
import { Mutex } from "async-mutex";

export const chats = signal(new Map<number, Chat>());

client.on("newChat", (ctx) => {
  chats.value = new Map(chats.value.set(ctx.newChat.id, ctx.newChat));
});

client.on("editedChat", (ctx) => {
  chats.value = new Map(chats.value.set(ctx.editedChat.id, ctx.editedChat));
});

let after: Chat | undefined = undefined;
let allLoaded = false;
const mutex = new Mutex();
export async function loadChats() {
  if (allLoaded) {
    return;
  }
  const release = await mutex.acquire();
  try {
    const limit = 100;
    const chats_ = await client.getChats({ after, limit });
    for (const chat of chats_) {
      chats.value = new Map(chats.value.set(chat.id, chat));
    }
    if (chats_.length < limit) {
      allLoaded = true;
    } else {
      after = chats_[chats_.length - 1];
    }
  } finally {
    release();
  }
}
