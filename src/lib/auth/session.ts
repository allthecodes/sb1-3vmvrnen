import { supabase } from '../supabase';
import { logger } from '../logging';
import { LOG_CATEGORIES } from '../logging/constants';

export async function getInitialSession() {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      logger.error(LOG_CATEGORIES.AUTH, 'Failed to get initial session', error);
      return null;
    }

    logger.info(LOG_CATEGORIES.AUTH, 'Initial session retrieved', {
      hasSession: !!session,
      userId: session?.user?.id
    });

    return session;
  } catch (error) {
    logger.error(LOG_CATEGORIES.AUTH, 'Exception getting initial session', error as Error);
    return null;
  }
}

export function subscribeToAuthChanges(callback: (session: any) => void) {
  const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
    logger.info(LOG_CATEGORIES.AUTH, 'Auth state changed', {
      event,
      hasSession: !!session,
      userId: session?.user?.id
    });
    
    callback(session);
  });

  return () => {
    logger.debug(LOG_CATEGORIES.AUTH, 'Unsubscribing from auth changes');
    subscription.unsubscribe();
  };
}