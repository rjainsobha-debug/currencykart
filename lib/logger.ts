type LogContext = Record<string, unknown>;

function write(level: "info" | "warn" | "error", message: string, context: LogContext = {}) {
  const entry = JSON.stringify({
    timestamp: new Date().toISOString(),
    level,
    message,
    ...context
  });
  if (level === "error") console.error(entry);
  else if (level === "warn") console.warn(entry);
  else console.info(entry);
}

export const logger = {
  info: (message: string, context?: LogContext) => write("info", message, context),
  warn: (message: string, context?: LogContext) => write("warn", message, context),
  error: (message: string, error?: unknown, context?: LogContext) =>
    write("error", message, {
      ...context,
      error: error instanceof Error ? { name: error.name, message: error.message, stack: error.stack } : error
    })
};
