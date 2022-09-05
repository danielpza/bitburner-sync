import * as assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

import * as chokidar from "chokidar";
import { cosmiconfig } from "cosmiconfig";
import * as esbuild from "esbuild";

import { uploadFile } from "./index.js";

const configresult = await cosmiconfig("bitburner-sync").search();

assert.ok(
  configresult?.config.AUTH_TOKEN,
  "Expected auth token in config file."
);

const watcher = chokidar.watch("*.{js,ts}", { ignored: "*.d.ts" });

/** @param {string} path */
async function upload(path) {
  console.log(`Uploading ${path}`);

  const content = await readFile(path, "utf8");

  const build = await esbuild.transform(content, { loader: "ts" });

  const buildpath = path.replace(/.ts$/, ".js");

  uploadFile(
    { filename: buildpath, code: build.code },
    /** @type {any} */ (configresult).config
  );
}

watcher.on("add", (path) => {
  upload(path);
});

watcher.on("change", (path) => {
  upload(path);
});
