import { createErrorReporterPlugin } from "@bight-ts/plugin-ops";

export const errorReporterPlugin = createErrorReporterPlugin({
  getReporter: (context) => context.services.errorReporter,
  includeTaskFailures: true,
  includeCommandErrors: true,
  includeInteractionErrors: true,
});
