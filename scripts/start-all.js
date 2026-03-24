import { spawn } from "child_process";

// Color codes for console output
const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
};

function log(color, prefix, message) {
  console.log(`${color}[${prefix}]${colors.reset} ${message}`);
}

log(colors.blue, "START", "Starting Next.js server with API routes...");

const next = spawn("npm", ["run", "dev"], {
  stdio: "inherit",
  shell: true,
});

next.on("error", (err) => {
  log(colors.yellow, "NEXT", `Failed to start: ${err.message}`);
});

next.on("close", (code) => {
  log(colors.yellow, "NEXT", `Process exited with code ${code}`);
  process.exit(code);
});

// Handle shutdown
process.on("SIGINT", () => {
  log(colors.yellow, "SHUTDOWN", "Shutting down server...");
  next.kill();
  process.exit(0);
});

log(colors.green, "READY", "Server starting...");
log(colors.green, "INFO", "Next.js with integrated API: http://localhost:3000");
