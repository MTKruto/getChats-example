import { BaseLocationHook, Route, Router } from "wouter-preact";
import { navigate, useLocationProperty } from "wouter-preact/use-location";
import { connectionState } from "../state/connectionState.ts";
import { ChatList } from "./ChatList/ChatList.tsx";
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
            "notConnected": (
              <TextWithSpinner>
                Connecting...
              </TextWithSpinner>
            ),
            "updating": <TextWithSpinner>Updating...</TextWithSpinner>,
            "waitingForNetwork": (
              <TextWithSpinner>Waiting for network...</TextWithSpinner>
            ),
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

function TextWithSpinner({ children }: { children: string }) {
  return (
    <div class="flex gap-2">
      <Spinner /> {children}
    </div>
  );
}

function Spinner() {
  return (
    <svg
      width="24"
      height="24"
      class="animate-spin"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
    >
      <path d="M12,4a8,8,0,0,1,7.89,6.7A1.53,1.53,0,0,0,21.38,12h0a1.5,1.5,0,0,0,1.48-1.75,11,11,0,0,0-21.72,0A1.5,1.5,0,0,0,2.62,12h0a1.53,1.53,0,0,0,1.49-1.3A8,8,0,0,1,12,4Z" />
    </svg>
  );
}
