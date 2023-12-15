import { ChatList } from "./ChatList/ChatList.tsx";
import { connectionState } from "../state/connectionState.ts";

export function App() {
  return (
    <>
      <div class="fixed top-0 w-full h-screen">
        <div class="w-full h-full max-w-xl mx-auto">
          <div class="w-full h-full border-x border-[#2C3848]"></div>
        </div>
      </div>
      <header class="sticky top-0 w-full max-w-xl mx-auto z-[300] bg-[#18212D]/50 backdrop-blur-[2px]">
        <div class="px-4 py-3 sm:border-x border-[#2C3848] border-b flex items-center justify-center mt-[1px]">
          {{
            "notConnected": "Connecting...",
            "updating": "Updating...",
            "ready": "Chats",
          }[connectionState.value]}
        </div>
      </header>
      <main class="w-full max-w-xl mx-auto">
        <ChatList />
      </main>
    </>
  );
}
