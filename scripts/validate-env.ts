import { validateEnv } from "../lib/env";
import { loadEnvConfig } from "@next/env";

try {
  loadEnvConfig(process.cwd());
  validateEnv();
  console.log("Environment variables are valid.");
} catch (error) {
  console.error(error);
  process.exit(1);
}
