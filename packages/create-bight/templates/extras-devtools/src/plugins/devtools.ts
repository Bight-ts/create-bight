import { createDevtoolsPlugin } from "@bight-ts/plugin-devtools";
import { env } from "~/config/env.js";
import type { AppServices } from "~/services/index.js";

export default createDevtoolsPlugin<AppServices>({
  enabled: env.NODE_ENV === "development",
});
