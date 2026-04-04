import { createI18nPlugin } from "@bight-ts/i18n";
import type { AppServices } from "~/services/index.js";

export default createI18nPlugin<AppServices>({
  getI18n: (context) => context.services.i18n,
});
