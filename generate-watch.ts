import fs from "node:fs/promises";
import { $ } from "bun";

async function watcherHandler() {
  try {
    await $`bun generate`;
  } catch (error) {
    console.error(error);
  }
}

const abortController = new AbortController();

async function main() {
  try {
    const watcher = fs.watch("./src", {
      persistent: true,
      recursive: true,
      signal: abortController.signal,
    });

    console.log("Watching for changes...");

    for await (const _ of watcher) {
      await watcherHandler();
    }
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      return;
    }

    throw error;
  }
}

main();

process.on("SIGINT", () => {
  abortController.abort();
});
