import { LOG_LEVELS } from './constants';
import { formatLogEntry, sanitizeContext } from './formatters';
import type { LogLevel, LogContext, LogEntry, Logger } from './types';

class ConsoleLogger implements Logger {
  private createLogEntry(
    level: LogLevel,
    category: string,
    message: string,
    error?: Error,
    context?: LogContext
  ): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      category,
      message,
      error,
      context: context ? sanitizeContext(context) : undefined
    };
  }

  private log(entry: LogEntry): void {
    const formattedEntry = formatLogEntry(entry);
    
    switch (entry.level) {
      case LOG_LEVELS.DEBUG:
        console.debug(formattedEntry);
        break;
      case LOG_LEVELS.INFO:
        console.info(formattedEntry);
        break;
      case LOG_LEVELS.WARN:
        console.warn(formattedEntry);
        break;
      case LOG_LEVELS.ERROR:
        console.error(formattedEntry);
        break;
    }
  }

  debug(category: string, message: string, context?: LogContext): void {
    this.log(this.createLogEntry(LOG_LEVELS.DEBUG, category, message, undefined, context));
  }

  info(category: string, message: string, context?: LogContext): void {
    this.log(this.createLogEntry(LOG_LEVELS.INFO, category, message, undefined, context));
  }

  warn(category: string, message: string, context?: LogContext): void {
    this.log(this.createLogEntry(LOG_LEVELS.WARN, category, message, undefined, context));
  }

  error(category: string, message: string, error?: Error, context?: LogContext): void {
    this.log(this.createLogEntry(LOG_LEVELS.ERROR, category, message, error, context));
  }
}

export const logger = new ConsoleLogger();