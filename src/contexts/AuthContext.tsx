import React, { createContext, useContext, useEffect } from 'react';
import { useAuthState, useAuthMethods } from '../lib/auth/hooks';
import { getInitialSession, subscribeToAuthChanges } from '../lib/auth/session';
import type { AuthContextType } from '../lib/auth/types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, loading, setUser, setLoading } = useAuthState();
  const authMethods = useAuthMethods({ user, setUser });

  useEffect(() => {
    getInitialSession().then(session => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return subscribeToAuthChanges(session => {
      setUser(session?.user ?? null);
      setLoading(false);
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, ...authMethods }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}