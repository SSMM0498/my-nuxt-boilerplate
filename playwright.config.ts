import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  outputDir: 'tests-output',
  snapshotDir: 'tests-output',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    actionTimeout: 0,
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: 'on',
    // headless: true,
  },

  projects: [
    {
      name: "setup",
      testDir: "./",
      testMatch: /.*\.setup\.ts/,
      use: { ...devices['Desktop Chrome'], channel: "chrome" },
    },
    {
      name: 'Google Chrome',
      dependencies: ["setup"],
      use: { ...devices['Desktop Chrome'], channel: 'chrome', storageState: "./auth.json" },
    },
  ],

  webServer: {
    command: "yarn serve",
    url: "http://localhost:3000"
  },
});