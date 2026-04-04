import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const packageJsonPath = join(process.cwd(), "packages", "create-bight", "package.json");
const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8"));

try {
  const publishedVersion = execFileSync(
    "npm",
    ["view", `${packageJson.name}@${packageJson.version}`, "version", "--json"],
    {
      stdio: ["ignore", "pipe", "pipe"],
      encoding: "utf8",
    },
  ).trim();

  if (publishedVersion) {
    console.error(
      `Refusing to publish ${packageJson.name}@${packageJson.version} because that version already exists on npm.`,
    );
    process.exit(1);
  }
} catch (error) {
  const stderr = String(error.stderr ?? "");

  if (stderr.includes("E404")) {
    console.log(`Version check passed for ${packageJson.name}@${packageJson.version}.`);
    process.exit(0);
  }

  console.error(stderr || String(error));
  process.exit(1);
}
