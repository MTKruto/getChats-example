import { install } from "@twind/core";
import presetTailwind from "@twind/preset-tailwind";

export function installTwind() {
  install({
    presets: [presetTailwind()],
    theme: { extend: { colors: { bg: "#18212D" } } },
  });
}
