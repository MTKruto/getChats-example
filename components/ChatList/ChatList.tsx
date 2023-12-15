import { Chat } from "./Chat.tsx";
import { chats } from "../../state/chats.ts";
import { useAutoAnimate } from "@formkit/auto-animate/preact";

export function ChatList() {
  const [parent] = useAutoAnimate();

  return (
    <div ref={parent} class="flex flex-col sm:border-x border-[#2C3848]">
      {[...chats.value.values()]
        .sort((a, b) => b.order.localeCompare(a.order))
        .map((chat) => <Chat key={chat.id}>{chat}</Chat>)}
    </div>
  );
}
