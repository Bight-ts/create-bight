import { createSchedulerPlugin, defineScheduledTask } from "@bight-ts/plugin-scheduler";

const heartbeatTask = defineScheduledTask({
  name: "heartbeat",
  intervalMs: 60_000,
  runOnStart: true,
  async run({ context }) {
    context.logger.debug("Scheduler heartbeat ran.");
  },
});

export const schedulerPlugin = createSchedulerPlugin({
  tasks: [heartbeatTask],
});
