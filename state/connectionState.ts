import { ConnectionState } from "mtkruto/mod.ts";
import { signal } from "@preact/signals";
import { client } from "../client.ts";

export const connectionState = signal<ConnectionState>("notConnected");

client.on("connectionState", (ctx) => {
  connectionState.value = ctx.connectionState;
});
