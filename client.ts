import { Client, StorageIndexedDB } from "mtkruto/mod.ts";

export const client = new Client(
  new StorageIndexedDB("client"),
  1, // replace this with a vaild API ID
  "", // replace this with a valid API hash
);

// @ts-ignore: d
globalThis.client = client; // just to be able to play around with it

export async function startClient() {
  await client.start();
}
