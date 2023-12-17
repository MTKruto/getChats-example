import { BaseLocationHook, Route, Router } from "wouter-preact";
import { navigate, useLocationProperty } from "wouter-preact/use-location";
import { ChatList } from "./ChatList/ChatList.tsx";
import { connectionState } from "../state/connectionState.ts";
import { Messages } from "./Messages/Messages.tsx";
import { title } from "../state/title.ts";

const hashLocation = () => window.location.hash.replace(/^#/, "") || "/";

const hashNavigate = (to: string) => navigate("#" + to);

const useHashLocation: BaseLocationHook = () => {
  const location = useLocationProperty(hashLocation);
  return [location, hashNavigate];
};

export function App() {
  return (
    <>
      <div class="fixed top-0 w-full h-screen events-none z-[-100]">
        <div class="w-full h-full max-w-xl mx-auto">
          <div class="w-full h-full border-x border-[#2C3848]"></div>
        </div>
      </div>
      <header class="sticky top-0 w-full max-w-xl mx-auto z-[300] bg-[#18212D]/50 backdrop-blur-[2px]">
        <div class="px-4 py-3 sm:border-x border-[#2C3848] border-b flex items-center justify-center mt-[1px] h-[65px]">
          {{
            "notConnected": "Connecting...",
            "updating": "Updating...",
            "ready": title.value,
          }[connectionState.value]}
        </div>
      </header>
      <main class="w-full max-w-xl mx-auto">
        <Router hook={useHashLocation}>
          <Route path="/" component={ChatList} />
          <Route path="/:id" component={Messages} />
        </Router>
      </main>
    </>
  );
}
