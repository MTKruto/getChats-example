import { Chat } from "./Chat.tsx";
import { chats, loadChats } from "../../state/chats.ts";
import { useAutoAnimate } from "@formkit/auto-animate/preact";
import { useEffect } from "preact/hooks";
import { createRef } from "preact";

export function ChatList() {
  const divRef = createRef<HTMLDivElement>();
  const [parent] = useAutoAnimate();

  useEffect(() => {
    const div = divRef.current;
    if (!div) {
      return;
    }
    const onScroll = () => {
      if (div.getBoundingClientRect().bottom <= window.innerHeight) {
        loadChats();
      }
    };
    document.addEventListener("scroll", onScroll);
    return () => document.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div ref={divRef}>
      <div ref={parent} class="flex flex-col sm:border-x border-[#2C3848]">
        {[...chats.value.values()]
          .sort((a, b) => b.order.localeCompare(a.order))
          .map((chat) => <Chat key={chat.id}>{chat}</Chat>)}
      </div>
    </div>
  );
}
