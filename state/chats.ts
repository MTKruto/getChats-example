import { Chat } from "mtkruto/mod.ts";
import { signal } from "@preact/signals";
import { Mutex } from "async-mutex";
import { client } from "../client.ts";

export const photos = signal(new Map<number, string>());
export const chats = signal(new Map<number, Chat>());

const chatPhotoMutex = new Mutex();
async function downloadChatPhoto(chat: Chat) {
  if (chat.photo) {
    const release = await chatPhotoMutex.acquire();
    try {
      let blob = new Blob();
      for await (const chunk of await client.download(chat.photo.smallFileId)) {
        blob = new Blob([blob, chunk]);
      }
      const currentUrl = photos.value.get(chat.id);
      if (currentUrl) {
        try {
          URL.revokeObjectURL(currentUrl);
        } catch (err) {
          console.trace(err);
        }
      }
      photos.value = new Map(
        photos.value.set(chat.id, URL.createObjectURL(blob)),
      );
    } finally {
      release();
    }
  }
}

client.on("newChat", (ctx) => {
  chats.value = new Map(chats.value.set(ctx.newChat.id, ctx.newChat));
  downloadChatPhoto(ctx.newChat);
});

client.on("editedChat", (ctx) => {
  chats.value = new Map(chats.value.set(ctx.editedChat.id, ctx.editedChat));
  downloadChatPhoto(ctx.editedChat);
});

client.on("deletedChat", (ctx) => {
  chats.value.delete(ctx.deletedChat.chatId);
  chats.value = new Map(chats.value);
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
      downloadChatPhoto(chat);
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
