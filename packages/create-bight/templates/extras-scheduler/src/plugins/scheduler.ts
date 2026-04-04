import {
  createSchedulerPlugin,
  createStorageSchedulerStore,
  defineScheduledTask,
} from "@bight-ts/plugin-scheduler";
import type { AppServices } from "~/services/index.js";

export default createSchedulerPlugin<AppServices>({
  tasks: [
    defineScheduledTask({
      name: "heartbeat",
      intervalMs: 60_000,
      runOnStart: true,
      async run({ context }) {
        context.logger.debug("Scheduler heartbeat ran.");
      },
    }),
  ],
  persistence: {
    store: createStorageSchedulerStore({
      getStorage: (context) => context.services.storage,
    }),
  },
});
