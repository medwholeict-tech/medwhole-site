import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { finalizeWorker } from "./cf-finalize.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const target = process.argv[2] || "website";
if (!["cms", "website"].includes(target)) throw new Error("Choose cms or website");
const directory = target === "cms" ? path.join(root, "cms") : root;
const require = createRequire(path.join(directory, "package.json"));
const adapterEntry = require.resolve("@opennextjs/cloudflare");
const cliEntry = path.resolve(path.dirname(adapterEntry), "../cli/index.js");
const preload = path.join(root, "scripts/windows-build-links.cjs").replaceAll("\\", "/");
const child = spawn(process.execPath, [cliEntry, "build", ...process.argv.slice(3)], {
  cwd: directory,
  stdio: "inherit",
  env: {
    ...process.env,
    CF_BUILD: "1",
    ...(process.platform === "win32" ? {
      NODE_OPTIONS: `${process.env.NODE_OPTIONS || ""} --require="${preload}"`.trim(),
    } : {}),
  },
});

child.on("exit", async (code) => {
  if (code !== 0) process.exit(code ?? 1);
  try {
    await finalizeWorker(directory);
  } catch (error) {
    console.error("Could not finalize the Cloudflare build:", error.message);
    process.exit(1);
  }
});
child.on("error", (error) => {
  console.error("Could not start the Cloudflare build:", error.message);
  process.exitCode = 1;
});
