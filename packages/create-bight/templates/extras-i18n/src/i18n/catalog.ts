export const i18nCatalog = {
  en: {
    commands: {
      hello: {
        description: "Reply with a localized greeting.",
        reply: "Hello from Bight.",
      },
    },
  },
  es: {
    commands: {
      hello: {
        description: "Responder con un saludo localizado.",
        reply: "Hola desde Bight.",
      },
    },
  },
} satisfies Record<string, Record<string, unknown>>;
