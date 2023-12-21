import { Sticker } from "mtkruto/mod.ts";
import { downloadFile, files } from "../state/files.ts";
import { useEffect } from "preact/hooks";
import { createRef } from "preact";
import { play } from "../lib/rlottie.ts";

export function Sticker({ children: sticker }: { children: Sticker }) {
  const url = files.value.get(sticker.fileUniqueId);
  const canvasRef = createRef();

  useEffect(() => {
    downloadFile(sticker.fileId, sticker.fileUniqueId);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (sticker.isAnimated && url !== undefined && canvas) {
      const controller = new AbortController();
      Promise.resolve().then(async () =>
        play(
          canvas,
          await fetch(url).then((v) => v.blob()),
          controller.signal,
        )
      );
      return () => controller.abort();
    }
  }, [url, canvasRef]);

  if (url && sticker.isAnimated) {
    return (
      <canvas class="inline" ref={canvasRef} width={212} height={212}>
      </canvas>
    );
  } else if (url) {
    return (
      <img
        src={url}
        class="max-w-full rounded-lg max-w-[212px] max-h-[212px]"
      />
    );
  } else {
    return null;
  }
}
