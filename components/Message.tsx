import { Chat, Message as Message_ } from "mtkruto/mod.ts";
import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";
import { client } from "../client.ts";
import { getMessageDate, getMessageSenderName } from "../utils.ts";
import { peerColors } from "../peer_colors.ts";
import { downloadChatPhoto } from "../state/chats.ts";
import { Photo } from "./ChatList/Photo.tsx";
import { RenderTextWithEntities } from "./RenderTextWithEntities.tsx";

export function Message(
  { children: message, hideSender }: {
    hideSender?: boolean;
    children: Message_;
  },
) {
  if (!message.text) {
    return null;
  }
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
        {sender.value
          ? <Photo small>{sender.value}</Photo>
          : <div class="w-[40px] min-w-[40px]"></div>}
        <div class="inline-flex flex-col w-full">
          {!hideSender && (
            <div class="flex items-center justify-between w-full">
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
            <div class="whitespace-pre-wrap float-left">
              <RenderTextWithEntities entities={message.entities ?? []}>
                {message.text}
              </RenderTextWithEntities>
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
