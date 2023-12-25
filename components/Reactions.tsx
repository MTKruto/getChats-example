import { MessageReaction } from "mtkruto/mod.ts";
import { CustomEmoji } from "./CustomEmoji.tsx";

function format(num: number) {
  return Math.abs(num) > 999
    ? Math.sign(num) * Number((Math.abs(num) / 1000).toFixed(1)) + "k"
    : Math.sign(num) * Math.abs(num);
}

export function Reactions(
  { children: reactions }: { children: MessageReaction[] },
) {
  if (!reactions.length) {
    return null;
  }
  return (
    <div class="flex gap-2.5">
      {reactions.map((v) => (
        <div
          key={JSON.stringify(v)}
          class={`flex gap-1.5 text-sm items-center justify-center px-3 py-1.5 rounded-2xl ${
            v.chosen ? "bg-blue-400" : "bg-bg2"
          }`}
        >
          {v.reaction.type == "emoji"
            ? (
              <>
                <div class="leading-tight text-[16px]">{v.reaction.emoji}</div>
                <div>{format(v.count)}</div>
              </>
            )
            : (
              <>
                <div class="h-[20px] w-[20px] rounded-md">
                  <CustomEmoji>{v.reaction.id}</CustomEmoji>
                </div>
                <div>{format(v.count)}</div>
              </>
            )}
        </div>
      ))}
    </div>
  );
}
