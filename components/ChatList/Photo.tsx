import { as, Chat as Chat_, types } from "mtkruto/mod.ts";
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
            class={`flex items-center justify-center text-3xl w-[60px] min-w-[60px] min-h-[60px] h-[60px] bg-${
              color ? `[${color}]` : "black"
            } ${corners}`}
          >
            {getLetterMark(chat)}
          </div>
        )
        : <img src={url} class={`w-[60px] h-[60px] ${corners}`} />}
    </>
  );
}
