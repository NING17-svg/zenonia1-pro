import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { getFinalRouteManifest } from "../src/lib/content";

const manifest = `${JSON.stringify(getFinalRouteManifest(), null, 2)}\n`;
const outputFlag = process.argv.indexOf("--output");

if (outputFlag >= 0) {
  const outputPath = process.argv[outputFlag + 1];
  if (!outputPath) throw new Error("--output requires a file path");
  const resolvedPath = resolve(process.cwd(), outputPath);
  writeFileSync(resolvedPath, manifest, "utf8");
  console.log(`route manifest written: ${resolvedPath}`);
} else {
  process.stdout.write(manifest);
}
