import { Chat as Chat_ } from "mtkruto/mod.ts";

export function Photo({ children: chat }: { children: Chat_ }) {
  if (chat.photo) {
    chat.photo.smallFileId;
  }
}
