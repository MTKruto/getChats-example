import { Chat as Chat_ } from "mtkruto/mod.ts";
import { photos } from "../../state/chats.ts";
// import { client } from "../../client.ts";

// await client.storage.init();
// const peerColors =
//   await client.storage.get<Record<number, string[]>>(["peerColors"]) ?? {};
// if (Object.keys(peerColors).length == 0) {
//   const { colors } = await client.api.help.getPeerColors({ hash: 0 }).then(
//     (v) => v[as](types.help.PeerColors),
//   );

//   for (const color of colors) {
//     color.color_id;
//     const colors_ = color.dark_colors ?? color.colors;
//     if (colors_ !== undefined) {
//       const { colors } = colors_[as](types.help.PeerColorSet);
//       if (colors.length > 0) {
//         peerColors[color.color_id] = colors.map((v) =>
//           "#" +
//           (v & 0x00FFFFFF).toString(16).padStart(6, "0")
//         );
//       }
//     }
//   }

//   await client.storage.set(["peerColors"], peerColors);
// }

export function Photo({ children: chat }: { children: Chat_ }) {
  const url = photos.value.get(chat.id);
  const isForum = chat.type == "supergroup" && chat.isForum;
  const corners = isForum ? "rounded-lg" : "rounded-full";
  return (
    <>
      {url == null
        ? (
          <div
            class={`w-[50px] min-w-[50px] min-h-[50px] h-[50px] bg-black ${corners}`} // TODO: fallback to chat.color
          >
          </div>
        )
        : <img src={url} class={`w-[50px] h-[50px] ${corners}`} />}
    </>
  );
}
