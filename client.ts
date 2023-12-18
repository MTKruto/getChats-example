import { Client, ConnectionError, StorageIndexedDB } from "mtkruto/mod.ts";

export const client = new Client(
  new StorageIndexedDB("client"),
  1, // replace this with a vaild API ID
  "", // replace this with a valid API hash
  { autoStart: false },
);

client.invoke.use(async (ctx, next) => {
  if (ctx.error instanceof ConnectionError) {
    if (!navigator.onLine) {
      await new Promise((r) => addEventListener("online", r, { once: true }));
    } else {
      await new Promise((r) => setTimeout(r, 1000));
    }
    return true;
  } else {
    return await next();
  }
});

// @ts-ignore: d
globalThis.client = client; // just to be able to play around with it

async function startClientInner() {
  while (true) {
    try {
      await client.start();
      break;
    } catch (err) {
      console.error(err);
      console.warn("Failed to start client. Retrying in 5 seconds.");
      await new Promise((r) => setTimeout(r, 5_000));
    }
  }
}
export async function startClient() {
  if (navigator.onLine) {
    await startClientInner();
  } else {
    addEventListener("online", async () => {
      await startClientInner();
    });
  }
}
