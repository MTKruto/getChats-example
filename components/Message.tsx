import { Chat, Message as Message_ } from "mtkruto/mod.ts";
import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";
import { client } from "../client.ts";
import { getMessageDate, getMessageSenderName } from "../utils.ts";
import { peerColors } from "../peer_colors.ts";
import { downloadChatPhoto } from "../state/chats.ts";
import { ChatPhoto } from "./ChatList/Photo.tsx";
import { RenderTextWithEntities } from "./RenderTextWithEntities.tsx";
import { Photo } from "./Photo.tsx";
import { Sticker } from "./Sticker.tsx";
import { Reactions } from "./Reactions.tsx";

export function Message(
  { children: message, hideSender }: {
    hideSender?: boolean;
    children: Message_;
  },
) {
  const text = message.text ?? message.caption;
  const entities = message.entities ?? message.captionEntities ?? [];
  const color = peerColors[
    message.senderChat?.color ?? message.from?.color ?? message.chat?.color ??
      0
  ][0];
  const sender = useSignal<Chat | null>(null);

  useEffect(() => {
    if (hideSender) {
      return;
    }
    (async () => {
      const id = message.chat.type == "channel"
        ? message.chat.id
        : (message.from?.id ?? message.senderChat?.id);
      if (id) {
        sender.value = await client.getChat(id);
        downloadChatPhoto(id);
      }
    })();
  }, []);

  return (
    <div
      class={`px-4 ${
        hideSender ? "pt-3" : "[&:not(:first-child)]:pt-6 first:pt-3"
      }`}
    >
      <div class="flex items-start gap-2">
        {message.chat.type != "channel" && (sender.value
          ? <ChatPhoto small>{sender.value}</ChatPhoto>
          : <div class="w-[40px] min-w-[40px]"></div>)}
        <div class="inline-flex flex-col w-full">
          {!hideSender && (
            <div class="flex items-center justify-between w-full gap-1.5">
              <div class={`text-[${color}]`}>
                {getMessageSenderName(message)}
              </div>
              <div class="opacity-50 text-xs">
                {message.editDate !== undefined && "edited "}
                {getMessageDate(message, true)}
              </div>
            </div>
          )}
          <div class="flex items-start justify-between">
            <div class="flex flex-col gap-2">
              {message.photo && <Photo>{message.photo}</Photo>}
              {message.sticker && <Sticker>{message.sticker}</Sticker>}
              {text && (
                <div class="whitespace-pre-wrap float-left select-text [&_*]:select-text break-all">
                  <RenderTextWithEntities
                    entities={entities}
                    color={message.from?.color ?? message.senderChat?.color ??
                      0}
                  >
                    {text}
                  </RenderTextWithEntities>
                </div>
              )}
              {message.reactions && <Reactions>{message.reactions}</Reactions>}
            </div>
            {hideSender && (
              <div class="opacity-50 self-start float-right text-right text-xs">
                {message.editDate !== undefined && "edited "}
                {getMessageDate(message, true)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
