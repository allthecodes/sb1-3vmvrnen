import { logger } from './logging/logger';
import { LOG_CATEGORIES } from './logging/constants';
import type { LogContext } from './logging/types';

export function logAuth(action: string, error: Error | unknown, context?: LogContext) {
  logger.error(LOG_CATEGORIES.AUTH, `${action} failed`, error as Error, context);
}

export function logDatabase(action: string, error: Error | unknown, context?: LogContext) {
  logger.error(LOG_CATEGORIES.DATABASE, `${action} failed`, error as Error, context);
}

export function logSession(action: string, data: LogContext) {
  logger.info(LOG_CATEGORIES.AUTH, `Session ${action}`, data);
}

export { logger };