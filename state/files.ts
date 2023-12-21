import { signal } from "@preact/signals";
import { client } from "../client.ts";
import { Mutex } from "async-mutex";

export const files = signal(new Map<string, string>());
export const decodedTgs = signal(new Map<string, string>());

const mutex = new Mutex();
export async function downloadFile(fileId: string, fileUniqueId: string) {
  if (files.value.has(fileUniqueId)) {
    return;
  }
  const release = await mutex.acquire();
  try {
    let blob = new Blob();
    for await (const chunk of client.download(fileId)) {
      blob = new Blob([blob, chunk]);
    }
    const url = URL.createObjectURL(blob);
    files.value = new Map(files.value.set(fileUniqueId, url));
  } finally {
    release();
  }
}

export const customEmoji = signal(new Map<string, string>());
export async function downloadCustomEmoji(id: string) {
  if (customEmoji.value.has(id)) {
    return;
  }
  const document = await client.getCustomEmojiDocuments(id).then((v) => v[0]);
  customEmoji.value.set(id, document.fileUniqueId);
}
