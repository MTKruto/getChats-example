import { Photo } from "mtkruto/mod.ts";
import { downloadFile, files } from "../state/files.ts";
import { useEffect } from "preact/hooks";
import { useSignal } from "@preact/signals";

export function Photo({ children: photo }: { children: Photo }) {
  const url = files.value.get(photo.fileId);
  const open = useSignal(false);

  useEffect(() => {
    downloadFile(photo.fileId, photo.fileUniqueId);
  }, []);

  if (url) {
    return (
      <>
        {open.value && (
          <div
            class="fixed top-0 left-0 w-full h-screen z-[400] bg-[#0003] flex items-center justify-center"
            onClick={() => (open.value = !open.value)}
          >
            <img
              src={url}
              class="max-w-screen-sm"
            />
          </div>
        )}
        <img
          src={url}
          class="max-w-full rounded-lg"
          onClick={() => (open.value = !open.value)}
        />
      </>
    );
  } else {
    return null;
  }
}
