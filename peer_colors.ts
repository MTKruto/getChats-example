import { as, types } from "mtkruto/mod.ts";
import { client } from "./client.ts";

await client.storage.init();
export const peerColors =
  await client.storage.get<Record<number, string[]>>(["peerColors"]) ?? {};
if (Object.keys(peerColors).length == 0) {
  const { colors } = await client.api.help.getPeerColors({ hash: 0 }).then(
    (v) => v[as](types.help.PeerColors),
  );

  for (const color of colors) {
    color.color_id;
    const colors_ = color.dark_colors ?? color.colors;
    if (colors_ !== undefined) {
      const { colors } = colors_[as](types.help.PeerColorSet);
      if (colors.length > 0) {
        peerColors[color.color_id] = colors.map((v) =>
          "#" +
          (v & 0x00FFFFFF).toString(16).padStart(6, "0")
        );
      }
    }
  }

  await client.storage.set(["peerColors"], peerColors);
}

peerColors[0] = ["#cc5049"];
peerColors[1] = ["#d67722"];
peerColors[2] = ["#955cdb"];
peerColors[3] = ["#40a920"];
peerColors[4] = ["#309eba"];
peerColors[5] = ["#368ad1"];
peerColors[6] = ["#c7508b"];
