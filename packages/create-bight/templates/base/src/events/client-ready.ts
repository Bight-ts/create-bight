import { defineAppEvent } from "~/bight.js";

export default defineAppEvent({
  name: "clientReady",
  once: true,
  execute({ args: [client], context }) {
    context.logger.info(`Logged in as ${client.user.tag}`);
  },
});
