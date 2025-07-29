import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/setupTests.js", // if you have one for jest-dom imports
  },
});
