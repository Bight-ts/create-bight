#!/usr/bin/env node
import color from "picocolors";
import process from "node:process";
import { parseFlags } from "./flags.js";
import { resolveOptions } from "./prompts.js";
import { validateOptions } from "./validate.js";
import { generateProject } from "./generate.js";

async function main(): Promise<void> {
  try {
    const flags = parseFlags(process.argv.slice(2));
    const options = await resolveOptions(flags);
    await validateOptions(options);
    const targetDir = await generateProject(options);

    console.log("");
    console.log(color.green(`Scaffolded ${options.name} in ${targetDir}`));
    console.log("");
    console.log("Next steps:");
    console.log(color.cyan(`  cd ${options.dir}`));

    if (!options.install) {
      console.log(color.cyan("  pnpm install"));
    }

    console.log(color.cyan("  cp .env.example .env"));
    console.log(color.cyan("  pnpm start:with-deploy"));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(color.red(`Error: ${message}`));
    process.exit(1);
  }
}

void main();
