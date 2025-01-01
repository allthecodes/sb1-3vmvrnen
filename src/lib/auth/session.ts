import { supabase } from '../supabase';
import { logAuth, logSession } from '../logging';

export async function getInitialSession() {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      logAuth('GET_SESSION_ERROR', error);
      return null;
    }

    logSession('INITIAL_SESSION', {
      hasSession: !!session,
      userId: session?.user?.id
    });

    return session;
  } catch (error) {
    logAuth('GET_SESSION_EXCEPTION', error);
    return null;
  }
}

export function subscribeToAuthChanges(callback: (session: any) => void) {
  const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
    logSession('AUTH_STATE_CHANGE', {
      event: _event,
      hasSession: !!session,
      userId: session?.user?.id
    });
    
    callback(session);
  });

  return () => subscription.unsubscribe();
}