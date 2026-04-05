#!/usr/bin/env node
import color from "picocolors";
import process from "node:process";
import { note, outro, spinner } from "@clack/prompts";
import { parseFlags } from "./flags.js";
import {
  formatInstallCommand,
  formatRunCommand,
} from "./package-manager.js";
import { resolveOptions } from "./prompts.js";
import { validateOptions } from "./validate.js";
import { generateProject } from "./generate.js";

async function main(): Promise<void> {
  try {
    const flags = parseFlags(process.argv.slice(2));
    const options = await resolveOptions(flags);
    await validateOptions(options);
    const projectSpinner = spinner();
    projectSpinner.start(`Scaffolding ${options.dir}`);
    const targetDir = await generateProject(options);
    projectSpinner.stop(color.green(`Scaffolded ${options.name} in ${targetDir}`));

    const nextSteps = [
      `cd ${options.dir}`,
      ...(!options.install ? [formatInstallCommand(options.packageManager)] : []),
      "cp .env.example .env",
      formatRunCommand(options.packageManager, "start:with-deploy"),
    ];

    note(nextSteps.join("\n"), "Next steps");
    outro(color.dim(`Ready with ${options.packageManager}.`));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(color.red(`Error: ${message}`));
    process.exit(1);
  }
}

void main();
