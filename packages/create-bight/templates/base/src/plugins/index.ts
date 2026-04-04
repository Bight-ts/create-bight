import { defineAppPlugins } from "./define.js";

/**
 * Register app plugins explicitly here.
 *
 * Services are app-owned dependencies that handlers call directly.
 * Plugins participate in the Bight lifecycle and can register behavior
 * around startup and login.
 */
export const appPlugins = defineAppPlugins([]);
