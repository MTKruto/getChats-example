import { inflate } from "https://esm.sh/pako@2.1.0";
import init from "./rlottie_wasm.js";

const mod = await init();

const RlottieWasm = mod.RlottieWasm;

export async function play(
  canvas: HTMLCanvasElement,
  data: Blob,
  signal: AbortSignal,
) {
  const instance = new RlottieWasm();
  const json = inflate(await data.arrayBuffer(), { to: "string" });
  instance.load(json);
  const frameCount = instance.frames();
  let currFrame = 0;
  function tick() {
    if (signal?.aborted) {
      return;
    }
    const context = canvas.getContext("2d");
    const buffer = instance.render(currFrame, canvas.width, canvas.height);
    const clampedBuffer = Uint8ClampedArray.from(buffer);
    const imageData = new ImageData(clampedBuffer, canvas.width, canvas.height);
    context?.putImageData(imageData, 0, 0);
    currFrame++;
    if (currFrame >= frameCount) {
      currFrame = 0;
    }
    requestAnimationFrame(() => tick());
  }

  tick();
}
