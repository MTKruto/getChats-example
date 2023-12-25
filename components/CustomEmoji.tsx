import { ComponentChildren, createRef } from "preact";
import { MessageEntity } from "mtkruto/3_types.ts";
import { useEffect } from "preact/hooks";
import { play } from "../lib/rlottie.ts";
import { useComputed, useSignal } from "@preact/signals";
import { client } from "../client.ts";
import { downloadFile, files } from "../state/files.ts";

export function CustomEmoji(
  { replacement, children, size = 20 }: {
    replacement?: ComponentChildren;
    children: MessageEntity.CustomEmoji | string;
    size?: number;
  },
) {
  const id = typeof children === "string" ? children : children.customEmojiId;
  const canvasRef = createRef();
  const fileUniqueId = useSignal("");
  const mimeType = useSignal("");
  const url = useComputed(() => files.value.get(fileUniqueId.value));

  useEffect(() => {
    Promise.resolve().then(async () => {
      const document = await client.getCustomEmojiDocuments(id).then((v) =>
        v[0]
      );
      fileUniqueId.value = document.fileUniqueId;
      mimeType.value = document.mimeType;
      downloadFile(document.fileId, document.fileUniqueId);
    });
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const url_ = url.value;
    if (canvas && url_ && mimeType.value == "application/x-tgsticker") {
      const controller = new AbortController();
      Promise.resolve().then(async () => {
        play(
          canvas,
          await fetch(url_).then((v) => v.blob()),
          controller.signal,
        );
      });
      return () => controller.abort();
    }
  }, [canvasRef, url.value, mimeType.value]);

  if (!url.value) {
    return <>{replacement}</>;
  }

  if (mimeType.value == "application/x-tgsticker") {
    return (
      <canvas class="inline-block" ref={canvasRef} width={size} height={size}>
      </canvas>
    );
  } else {
    return <img src={url.value} class={`inline w-[${size}px] h-[${size}px]`} />;
  }
}
