import { install } from "@twind/core";
import presetTailwind from "@twind/preset-tailwind";

export function installTwind() {
  install({ presets: [presetTailwind()] });
}
