import { WeberProfileError } from "../weber-profile-exception/WeberProfileError";

export class Logger {
  static #listeners = new Map();

  static on(eventName, callback) {
    if (!this.#listeners.has(eventName)) {
      this.#listeners.set(eventName, []);
    }
    this.#listeners.get(eventName).push(callback);
  }

  static emit(eventName, data) {
    if (!this.#listeners.has(eventName)) return;
    this.#listeners.get(eventName).forEach((callback) => callback(data));
  }

  static setup() {
    Logger.on("error", (data) => {
      console.error(`🔴 [ERROR] ${Logger.log(data.message, data.meta)}`);
    });
    Logger.on("warn", (data) => {
      console.warn(`🟡 [WARN] ${Logger.log(data.message, data.meta)}`);
    });
    Logger.on("info", (data) => {
      console.info(`🔵 [INFO] ${Logger.log(data.message, data.meta)}`);
    });
    Logger.on("debug", (data) => {
      console.debug(`🟣 [DEBUG] ${Logger.log(data.message, data.meta)}`);
    });
  }

  static log(message, metadata = {}) {
    return JSON.stringify({
      timestamp: new Date().toISOString(),
      message,
      ...metadata,
    });
  }

  static throw(error, operation, meta = {}) {
    if (!(error instanceof WeberProfileError)) {
      error = new WeberProfileError(
        error.message,
        error.name || "UnknownError",
        error.context || operation,
        error.status ?? 500,
      );
    }
    const payload = {
      message: error.message,
      meta: {
        operation,
        status: error.status,
        errorName: error.name,
        errorContext: error.context,
        ...meta,
      },
    };
    Logger.emit(error.status >= 500 ? "error" : "warn", payload);
    throw error;
  }
}
