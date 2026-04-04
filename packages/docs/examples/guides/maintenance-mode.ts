import { createMaintenanceModePlugin } from "@bight-ts/plugin-ops";

export const maintenanceModePlugin = createMaintenanceModePlugin({
  getState: async (context) => context.services.maintenanceSettings.get(),
  setState: async (context, state) => {
    await context.services.maintenanceSettings.set(state);
  },
  includeCommand: true,
});
