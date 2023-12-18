import { ConnectionState } from "mtkruto/mod.ts";
import { signal } from "@preact/signals";
import { client } from "../client.ts";

export const connectionState = signal<
  ConnectionState | "waitingForNetwork"
>(navigator.onLine ? "notConnected" : "waitingForNetwork");

client.on("connectionState", (ctx) => {
  connectionState.value = ctx.connectionState;
});

addEventListener("offline", () => {
  connectionState.value = "waitingForNetwork";
});
