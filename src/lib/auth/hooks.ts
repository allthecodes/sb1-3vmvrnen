import { useState } from 'react';
import { supabase } from '../supabase';
import { logAuth, logSession } from '../logging';
import type { User } from '@supabase/supabase-js';
import type { AuthState, AuthMethods } from './types';

export function useAuthState(): AuthState {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  return {
    user,
    loading,
    setUser,
    setLoading
  };
}

export function useAuthMethods({ user, setUser }: AuthState & { setUser: (user: User | null) => void }): AuthMethods {
  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password
      });
      
      if (error) throw error;
      setUser(data.user);
    } catch (error) {
      logAuth('SIGN_IN_ERROR', error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            full_name: email.split('@')[0]
          }
        }
      });
      
      if (error) throw error;
      setUser(data.user);
    } catch (error) {
      logAuth('SIGN_UP_ERROR', error);
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            prompt: 'select_account'
          }
        }
      });
      
      if (error) throw error;
    } catch (error) {
      logAuth('GOOGLE_SIGN_IN_ERROR', error);
      throw error;
    }
  };

  const signInWithApple = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'apple',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            response_mode: 'fragment'
          }
        }
      });
      
      if (error) throw error;
    } catch (error) {
      logAuth('APPLE_SIGN_IN_ERROR', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
    } catch (error) {
      logAuth('SIGN_OUT_ERROR', error);
      throw error;
    }
  };

  return {
    signIn,
    signUp,
    signInWithGoogle,
    signInWithApple,
    signOut
  };
}