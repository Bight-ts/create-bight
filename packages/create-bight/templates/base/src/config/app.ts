import { env } from "./env.js";

export function isDevelopment() {
  return env.NODE_ENV === "development";
}

export function getDefaultDeploymentMode() {
  return env.COMMAND_DEPLOYMENT_MODE;
}

export function cooldownsEnabled() {
  return env.COMMAND_COOLDOWNS_ENABLED === "true";
}

export function getDefaultCooldownSeconds() {
  return env.DEFAULT_COMMAND_COOLDOWN_SECONDS;
}
