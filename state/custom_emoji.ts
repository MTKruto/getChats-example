import { signal } from "@preact/signals";
import { client } from "../client.ts";
import { Mutex } from "async-mutex";

export const customEmoji = signal(
  new Map<string, { url: string, blob: Blob; mimeType: string }>(),
);

const mutex = new Mutex();
export async function downloadCustomEmoji(id: string) {
  if (customEmoji.value.has(id)) {
    return;
  }
  const release = await mutex.acquire();
  try {
    const document = await client.getCustomEmojiDocuments(id).then((v) => v[0]); // TODO: cache
    let blob = new Blob();
    for await (const chunk of client.download(document.fileId)) {
      blob = new Blob([blob, chunk], { type: document.mimeType });
    }
    const url = URL.createObjectURL(blob)
    customEmoji.value = new Map(
      customEmoji.value.set(id, { url, blob, mimeType: document.mimeType }),
    );
  } finally {
    release();
  }
}
