import {
  definePlugin,
  definePlugins,
  type BightPlugin,
  type MaybeBightPlugin,
} from "@bight-ts/core";
import type { AppServices } from "~/services/index.js";

export const defineAppPlugin = (plugin: BightPlugin<AppServices>) => definePlugin(plugin);

export const defineAppPlugins = (plugins: MaybeBightPlugin<AppServices>[]) =>
  definePlugins<AppServices>(plugins);
