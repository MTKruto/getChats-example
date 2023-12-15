import * as path from "std/path/mod.ts";
import { serveDir } from "std/http/file_server.ts";
import { bundle } from "emit/mod.ts";

const DIRNAME = path.dirname(path.fromFileUrl(import.meta.url));

async function build() {
  const { code } = await bundle(
    path.toFileUrl(path.join(DIRNAME, "main.tsx")),
    {
      importMap: "./import_map.json",
      // minify: true,
      compilerOptions: {
        jsxFactory: "h",
        jsxFragmentFactory: "Fragment",
      },
    },
  );
  await Deno.writeTextFile("./public/main.js", code);
}

if (Deno.args.includes("--watch")) {
  Deno.serve((req) => {
    return serveDir(req, { fsRoot: "./public" });
  });
  while (true) {
    await new Promise((r) => setTimeout(r, 2000));
    try {
      console.log("Rebuilding...");
      const then = performance.now();
      await build();
      console.log("Rebuilt in", Math.floor(performance.now() - then) + "ms.");
    } catch (err) {
      console.error(err);
      continue;
    }
  }
} else {
  console.log("Building...");
  const then = performance.now();
  await build();
  console.log("Built in", Math.floor(performance.now() - then) + "ms.");
}
