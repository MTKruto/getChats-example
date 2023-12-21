import { install } from "@twind/core";
import presetTailwind from "@twind/preset-tailwind";

export function installTwind() {
  install({
    hash: false,
    presets: [presetTailwind()],
    theme: { extend: { colors: { bg: "#18212D", bg2: "#1e2b3b" } } },
  });
}
