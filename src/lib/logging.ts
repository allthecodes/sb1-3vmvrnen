import { AuthError } from '@supabase/supabase-js';
import { PostgrestError } from '@supabase/postgrest-js';

// Log levels
const LOG_LEVELS = {
  DEBUG: 'DEBUG',
  INFO: 'INFO',
  WARN: 'WARN',
  ERROR: 'ERROR'
} as const;

// Structured logging
export function logAuth(action: string, error: AuthError | Error | unknown, context?: Record<string, unknown>) {
  console.error(`[AUTH][${action}] Error:`, {
    name: error instanceof Error ? error.name : 'Unknown',
    message: error instanceof Error ? error.message : 'Unknown error',
    status: error instanceof AuthError ? error.status : undefined,
    context,
    timestamp: new Date().toISOString(),
  });
}

export function logDatabase(action: string, error: PostgrestError | Error | unknown, context?: Record<string, unknown>) {
  console.error(`[DATABASE][${action}] Error:`, {
    name: error instanceof Error ? error.name : 'Unknown',
    message: error instanceof Error ? error.message : 'Unknown error',
    code: error instanceof PostgrestError ? error.code : undefined,
    details: error instanceof PostgrestError ? error.details : undefined,
    hint: error instanceof PostgrestError ? error.hint : undefined,
    context,
    timestamp: new Date().toISOString(),
  });
}

export function logSession(action: string, data: Record<string, unknown>) {
  console.log(`[SESSION][${action}]`, {
    ...data,
    timestamp: new Date().toISOString(),
  });
}