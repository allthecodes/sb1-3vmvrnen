import type { LogEntry, LogContext } from './types';

export function formatLogEntry(entry: LogEntry): string {
  const timestamp = new Date(entry.timestamp).toISOString();
  const context = entry.context ? `\nContext: ${JSON.stringify(entry.context, null, 2)}` : '';
  const error = entry.error ? `\nError: ${entry.error.message}\nStack: ${entry.error.stack}` : '';
  
  return `[${timestamp}] ${entry.level.toUpperCase()} [${entry.category}] ${entry.message}${context}${error}`;
}

export function sanitizeContext(context: LogContext): LogContext {
  const sanitized = { ...context };
  
  // Remove sensitive data
  const sensitiveKeys = ['password', 'token', 'secret', 'key'];
  for (const key of Object.keys(sanitized)) {
    if (sensitiveKeys.some(sensitive => key.toLowerCase().includes(sensitive))) {
      sanitized[key] = '[REDACTED]';
    }
  }
  
  return sanitized;
}