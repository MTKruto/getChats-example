import { Fragment, h } from "preact";
// @ts-ignore: w
globalThis.h = h;
// @ts-ignore: w
globalThis.Fragment = Fragment;

import { render } from "preact";
import { installTwind } from "./twind.ts";
import { startClient } from "./client.ts";
import { App } from "./components/App.tsx";

installTwind();

render(<App />, document.body);

await startClient();
