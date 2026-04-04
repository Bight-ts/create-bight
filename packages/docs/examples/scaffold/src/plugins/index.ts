import { definePlugins } from "@bight-ts/core";
import { createDevtoolsPlugin } from "@bight-ts/plugin-devtools";

export const appPlugins = definePlugins([
  process.env.NODE_ENV === "development" && createDevtoolsPlugin(),
]);
