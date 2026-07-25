// @ts-nocheck
import { defineConfig } from "@prisma/config";

export default defineConfig({
  earlyAccess: true,
  migrate: {
    url: "file:./dev.db",
  },
  studio: {
    url: "file:./dev.db",
  },
  datasource: {
    url: "file:./dev.db",
  },
});
