export const LOG_LEVELS = {
  DEBUG: 'debug',
  INFO: 'info',
  WARN: 'warn',
  ERROR: 'error'
} as const;

export const LOG_CATEGORIES = {
  AUTH: 'auth',
  DATABASE: 'database',
  API: 'api',
  NAVIGATION: 'navigation',
  PERFORMANCE: 'performance',
  USER_ACTION: 'user_action',
  ERROR: 'error',
  SECURITY: 'security'
} as const;