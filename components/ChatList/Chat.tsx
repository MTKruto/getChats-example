import { Chat as Chat_, Message } from "mtkruto/mod.ts";
import { Photo } from "./Photo.tsx";

function getTitle(chat: Chat_) {
  if ("title" in chat) {
    return chat.title;
  } else {
    return ((chat.firstName || "") + " " + (chat.lastName || "")).trim();
  }
}

function getSenderName(message: Message) {
  if (message.from) {
    return ((message.from.firstName || "") + " " +
      (message.from.lastName || "")).trim();
  } else if (message.senderChat) {
    if (
      "title" in message.senderChat && message.senderChat.id != message.chat.id
    ) {
      return message.senderChat.title;
    }
  }
  return null;
}

function getDate(date: Date) {
  const now = Date.now();
  const diff = now - date.getTime();
  if (diff <= 86_340_000) { // less than 24 hours
    return date.getHours().toString().padStart(2, "0") + ":" +
      date.getMinutes().toString().padStart(2, "0");
  } else if (diff <= 514_800_000) { // less than about a week
    return {
      0: "Sun",
      1: "Mon",
      2: "Tue",
      3: "Wed",
      4: "Thu",
      5: "Fri",
      6: "Sat",
    }[date.getDay()];
  } else {
    return date.getMonth().toString() + "/" + date.getDate().toString() + "/" +
      (date.getFullYear() - 2000).toString();
  }
}

export function Chat({ children: chat }: { children: Chat_ }) {
  return (
    <div
      class={`flex pl-3 gap-3 items-center overflow-hidden ${
        chat.pinned == -1 ? "bg-[#18212D]" : "bg-[#1e2938]"
      }`}
    >
      <Photo>{chat}</Photo>
      <div
        class={`py-2 pr-3 w-full overflow-hidden border-b border-[#2C3848] min-h-[81px]`}
      >
        <div class="flex gap-1 items-start justify-between">
          <div class="font-bold">{getTitle(chat)}</div>
          {chat.lastMessage && (
            <div class="opacity-50 text-sm">
              {getDate(chat.lastMessage.date)}
            </div>
          )}
        </div>
        {chat.lastMessage && (
          <>
            {(() => {
              if (!chat.lastMessage) {
                return null;
              }
              const sender = getSenderName(chat.lastMessage);
              if (sender !== null) {
                return (
                  <div class="font-medium text-sm">
                    {sender}
                  </div>
                );
              } else {
                return null;
              }
            })()}
            <div class="flex items-center overflow-hidden gap-1">
              {Object.keys(chat.lastMessage).some((v) =>
                [
                  "photo",
                  "video",
                  "audio",
                  "voice",
                  "sticker",
                  "contact",
                  "animation",
                ]
                  .includes(v)
              ) && (
                <div class="text-sm opacity-50">
                  {"photo" in chat.lastMessage && "🖼 Photo"}
                  {"video" in chat.lastMessage && "🎥 Video"}
                  {"audio" in chat.lastMessage && "🎵 Audio"}
                  {"voice" in chat.lastMessage && "🎙 Voice"}
                  {"sticker" in chat.lastMessage && (
                    <>
                      {chat.lastMessage.sticker?.emoji
                        ? (chat.lastMessage.sticker.emoji + " ")
                        : ""}Sticker
                    </>
                  )}
                  {"contact" in chat.lastMessage && "Contact"}
                  {"animation" in chat.lastMessage && "GIF"}
                </div>
              )}
              {(chat.lastMessage.text || chat.lastMessage.caption) && (
                <div class="text-sm opacity-50 truncate">
                  {chat.lastMessage.text || chat.lastMessage.caption}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
