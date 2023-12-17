import { Chat as Chat_ } from "mtkruto/mod.ts";
import { photos } from "../../state/chats.ts";
import { peerColors } from "../../peer_colors.ts";

function getLetterMark(chat: Chat_) {
  if ("title" in chat) {
    return chat.title[0].toUpperCase();
  } else {
    return ((chat.firstName[0] || "") + " " + (chat.lastName?.[0] || ""))
      .trim().toUpperCase();
  }
}

// https://stackoverflow.com/a/6444043
function brighten(hex: string, by: number) {
  hex = hex.replace(/^\s*#|\s*$/g, "");
  if (hex.length == 3) {
    hex = hex.replace(/(.)/g, "$1$1");
  }
  const r = parseInt(hex.substring(0, 2), 16),
    g = parseInt(hex.substring(2, 4), 16),
    b = parseInt(hex.substring(4, 6), 16);
  return "#" +
    ((0 | (1 << 8) + r + (256 - r) * by).toString(16)).substring(1) +
    ((0 | (1 << 8) + g + (256 - g) * by).toString(16)).substring(1) +
    ((0 | (1 << 8) + b + (256 - b) * by).toString(16)).substring(1);
}

export function Photo({ children: chat }: { children: Chat_ }) {
  const url = photos.value.get(chat.id);
  const isForum = chat.type == "supergroup" && chat.isForum;
  const corners = isForum ? "rounded-xl" : "rounded-full";
  const color = peerColors[chat.color][0];
  return (
    <>
      {url == null
        ? (
          <div
            class={`flex items-center justify-center leading-none overflow-hidden text-2xl w-[60px] min-w-[60px] min-h-[60px] h-[60px] bg-gradient-to-b from-[${
              brighten(color, 0.6)
            }] to-[${color}] ${corners}`}
          >
            <div style="translate-y-[-1px] z-[2]">{getLetterMark(chat)}</div>
          </div>
        )
        : <img src={url} class={`w-[60px] h-[60px] ${corners}`} />}
    </>
  );
}
