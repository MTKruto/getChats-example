import { useAutoAnimate } from "@formkit/auto-animate/preact";
import { Link, Redirect, useParams } from "wouter-preact";
import { useEffect } from "preact/hooks";
import { Message } from "../Message.tsx";
import { Title } from "../../state/title.ts";
import { getChatTitle } from "../../utils.ts";
import { Photo } from "../ChatList/Photo.tsx";
import { chat, loadMessages, messages } from "../../state/messages.ts";

export function Messages() {
  const [parent] = useAutoAnimate();
  const { id } = useParams();
  const chatId = Number(id);
  if (isNaN(chatId)) {
    return <Redirect to="/" />;
  }

  useEffect(() => {
    loadMessages(chatId);
  }, []);

  return (
    <div ref={parent} class="flex flex-col">
      {messages.value.length > 0 && (
        <Title>
          <Link to="/" class="flex gap-2 items-center hover:opacity-50">
            {chat.value && <Photo small>{chat.value}</Photo>}
            {getChatTitle(messages.value[0].chat)}
          </Link>
        </Title>
      )}
      {messages.value.map((v, i) => {
        let hideSender: boolean;
        if (i == 0) {
          hideSender = false;
        }
        const prev = messages.value[i - 1];
        const prevId = prev?.from?.id ?? prev?.senderChat?.id ?? v.chat?.id ??
          NaN;
        const currId = v.from?.id ?? v.senderChat?.id ?? v.chat?.id ?? NaN;
        if (prevId == currId) {
          hideSender = true;
        } else {
          hideSender = false;
        }
        return (
          <Message
            key={`${v.id}-${hideSender}`}
            hideSender={hideSender}
          >
            {v}
          </Message>
        );
      })}
    </div>
  );
}
