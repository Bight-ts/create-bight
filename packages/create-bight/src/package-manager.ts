import process from "node:process";
import type { PackageManager } from "./types.js";

export function detectPackageManager(
  userAgent: string | undefined = process.env.npm_config_user_agent,
): PackageManager {
  if (!userAgent) {
    return "pnpm";
  }

  if (userAgent.startsWith("bun/")) {
    return "bun";
  }

  if (userAgent.startsWith("yarn/")) {
    return "yarn";
  }

  if (userAgent.startsWith("npm/")) {
    return "npm";
  }

  if (userAgent.startsWith("pnpm/")) {
    return "pnpm";
  }

  return "pnpm";
}

export function getPackageManagerInstallCommand(packageManager: PackageManager) {
  return {
    command: packageManager,
    args: ["install"],
  };
}

export function formatInstallCommand(packageManager: PackageManager) {
  return `${packageManager} install`;
}

export function formatRunCommand(
  packageManager: PackageManager,
  scriptName: string,
) {
  if (packageManager === "npm" || packageManager === "bun") {
    return `${packageManager} run ${scriptName}`;
  }

  return `${packageManager} ${scriptName}`;
}

export function getPackageManagerLabel(packageManager: PackageManager) {
  if (packageManager === "pnpm") {
    return "pnpm";
  }

  if (packageManager === "npm") {
    return "npm";
  }

  if (packageManager === "yarn") {
    return "Yarn";
  }

  return "Bun";
}
