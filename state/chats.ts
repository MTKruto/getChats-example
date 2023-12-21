import { Chat, ChatID } from "mtkruto/mod.ts";
import { signal } from "@preact/signals";
import { Mutex } from "async-mutex";
import { client } from "../client.ts";

export const photos = signal(new Map<number, string>());
export const chats = signal(new Map<number, Chat>());
const downloadedPhotos = new Set<string>();

const chatPhotoMutex = new Mutex();
export async function downloadChatPhoto(chatId: ChatID) {
  const chat = await client.getChat(chatId);
  await downloadChatPhoto_(chat);
}
async function downloadChatPhoto_(chat: Chat) {
  if (chat.photo) {
    const release = await chatPhotoMutex.acquire();
    if (downloadedPhotos.has(chat.photo.smallFileUniqueId)) {
      return;
    }
    try {
      let blob = new Blob();
      for await (const chunk of client.download(chat.photo.smallFileId)) {
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
      downloadedPhotos.add(chat.photo.smallFileUniqueId);
    } finally {
      release();
    }
  }
}

client.on("newChat", (ctx) => {
  chats.value = new Map(chats.value.set(ctx.newChat.id, ctx.newChat));
  downloadChatPhoto_(ctx.newChat);
});

client.on("editedChat", (ctx) => {
  chats.value = new Map(chats.value.set(ctx.editedChat.id, ctx.editedChat));
  downloadChatPhoto_(ctx.editedChat);
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
      downloadChatPhoto_(chat);
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
