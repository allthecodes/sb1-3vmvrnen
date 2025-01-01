import { supabase } from '../supabase';
import { getRedirectUrl } from './redirect';

export async function handleAuthCallback(): Promise<void> {
  try {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const queryParams = new URLSearchParams(window.location.search);
    
    // Handle both hash and query parameters for different OAuth providers
    const code = hashParams.get('code') || queryParams.get('code');
    
    if (!code) {
      throw new Error('No code found in URL');
    }

    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) throw error;
    if (!data.session) throw new Error('No session found');

    return;
  } catch (error) {
    console.error('Auth callback error:', error);
    throw error;
  }
}