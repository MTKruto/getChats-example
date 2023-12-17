import { Chat as Chat_, Message } from "mtkruto/mod.ts";
import { Link } from "wouter-preact";
import { getMessageDate,getChatTitle, getMessageSenderName } from "../../utils.ts";
import { Photo } from "./Photo.tsx";


function getText(message: Message | undefined) {
  let text = message?.text || message?.caption || "";
  while (text.includes("\n\n")) {
    text = text.replaceAll("\n\n", "\n");
  }
  return text.replaceAll("\n", " ");
}

function Verified() {
  return (
    <span>
      <svg class="h-5 w-5 inline translate-y-[-1px]" viewBox="0 0 24 24">
        <path
          d="M12.3 2.9c.1.1.2.1.3.2.7.6 1.3 1.1 2 1.7.3.2.6.4.9.4.9.1 1.7.2 2.6.2.5 0 .6.1.7.7.1.9.1 1.8.2 2.6 0 .4.2.7.4 1 .6.7 1.1 1.3 1.7 2 .3.4.3.5 0 .8-.5.6-1.1 1.3-1.6 1.9-.3.3-.5.7-.5 1.2-.1.8-.2 1.7-.2 2.5 0 .4-.2.5-.6.6-.8 0-1.6.1-2.5.2-.5 0-1 .2-1.4.5-.6.5-1.3 1.1-1.9 1.6-.3.3-.5.3-.8 0-.7-.6-1.4-1.2-2-1.8-.3-.2-.6-.4-.9-.4-.9-.1-1.8-.2-2.7-.2-.4 0-.5-.2-.6-.5 0-.9-.1-1.7-.2-2.6 0-.4-.2-.8-.4-1.1-.6-.6-1.1-1.3-1.6-2-.4-.4-.3-.5 0-1 .6-.6 1.1-1.3 1.7-1.9.3-.3.4-.6.4-1 0-.8.1-1.6.2-2.5 0-.5.1-.6.6-.6.9-.1 1.7-.1 2.6-.2.4 0 .7-.2 1-.4.7-.6 1.4-1.2 2.1-1.7.1-.2.3-.3.5-.2z"
          class="fill-white"
        />
        <path
          d="M16.4 10.1l-.2.2-5.4 5.4c-.1.1-.2.2-.4 0l-2.6-2.6c-.2-.2-.1-.3 0-.4.2-.2.5-.6.7-.6.3 0 .5.4.7.6l1.1 1.1c.2.2.3.2.5 0l4.3-4.3c.2-.2.4-.3.6 0 .1.2.3.3.4.5.2 0 .3.1.3.1z"
          class="fill-bg"
        />
      </svg>
    </span>
  );
}

export function Chat({ children: chat }: { children: Chat_ }) {
  return (
    <Link
      href={`/${chat.id}`}
      class={`flex pl-3 gap-3 items-center overflow-hidden cursor-default hover:opacity-50 duration-100 ${
        chat.pinned == -1 ? "bg-bg" : "bg-[#1e2938]"
      }`}
    >
      <Photo>{chat}</Photo>
      <div
        class={`py-2 pr-3 w-full overflow-hidden border-b border-[#2C3848] min-h-[81px]`}
      >
        <div class="flex gap-1 items-start justify-between">
          <div class="font-medium flex items-center justify-center gap-0.5">
            {getChatTitle(chat)}
            {"isVerified" in chat && chat.isVerified && <Verified />}
          </div>
          {chat.lastMessage && (
            <div class="opacity-50 text-sm">
              {getMessageDate(chat.lastMessage)}
            </div>
          )}
        </div>
        {chat.lastMessage && (
          <>
            {(() => {
              if (!chat.lastMessage) {
                return null;
              }
              const sender = getMessageSenderName(chat.lastMessage);
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
                  {getText(chat.lastMessage)}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </Link>
  );
}
