import { createClient } from '@supabase/supabase-js';
import { logger } from './logging';
import { LOG_CATEGORIES } from './logging/constants';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  logger.error(LOG_CATEGORIES.AUTH, 'Missing Supabase environment variables', undefined, {
    hasUrl: !!supabaseUrl,
    hasKey: !!supabaseAnonKey
  });
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: localStorage
  }
});

// Add retry mechanism for database operations
export async function retryOperation<T>(
  operation: () => Promise<T>,
  maxRetries = 3,
  delay = 1000
): Promise<T> {
  let lastError: any;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      logger.warn(LOG_CATEGORIES.DATABASE, `Operation failed, attempt ${attempt + 1}/${maxRetries}`, {
        error: error as Error,
        nextRetryIn: delay * Math.pow(2, attempt)
      });
      
      if (attempt < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, attempt)));
      }
    }
  }
  
  logger.error(LOG_CATEGORIES.DATABASE, 'Operation failed after all retries', lastError);
  throw lastError;
}

// Add connection status check
export async function checkSupabaseConnection(): Promise<boolean> {
  try {
    const { error } = await supabase.from('profiles').select('count', { count: 'exact', head: true });
    const isConnected = !error;
    
    logger.info(LOG_CATEGORIES.DATABASE, 'Connection check completed', {
      isConnected,
      error: error?.message
    });
    
    return isConnected;
  } catch (err) {
    logger.error(LOG_CATEGORIES.DATABASE, 'Connection check failed', err as Error);
    return false;
  }
}