import { ComponentChildren } from "preact";
import { signal } from "@preact/signals";
import { useEffect } from "preact/hooks";

export const title = signal<ComponentChildren>(null);

export function Title({ children }: { children: ComponentChildren }) {
  useEffect(() => {
    title.value = children;
  }, []);
  return null;
}
