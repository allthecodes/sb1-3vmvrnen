import { renderHook, act } from '@testing-library/react-hooks';
import { useAuthState, useAuthMethods } from '../hooks';
import { supabase } from '../../supabase';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock Supabase
vi.mock('../../supabase', () => ({
  supabase: {
    auth: {
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
      signInWithOAuth: vi.fn(),
      signOut: vi.fn()
    }
  }
}));

describe('useAuthState', () => {
  it('should initialize with null user and loading true', () => {
    const { result } = renderHook(() => useAuthState());
    
    expect(result.current.user).toBeNull();
    expect(result.current.loading).toBe(true);
  });

  it('should update user and loading state', () => {
    const { result } = renderHook(() => useAuthState());
    
    act(() => {
      result.current.setUser({ id: '123', email: 'test@example.com' } as any);
      result.current.setLoading(false);
    });

    expect(result.current.user?.id).toBe('123');
    expect(result.current.loading).toBe(false);
  });
});

describe('useAuthMethods', () => {
  const mockUser = { id: '123', email: 'test@example.com' };
  const mockSetUser = vi.fn();
  
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should handle successful sign in', async () => {
    const mockSignInResponse = {
      data: { user: mockUser },
      error: null
    };
    
    (supabase.auth.signInWithPassword as any).mockResolvedValue(mockSignInResponse);

    const { result } = renderHook(() => 
      useAuthMethods({ 
        user: null, 
        loading: false, 
        setUser: mockSetUser 
      })
    );

    await act(async () => {
      await result.current.signIn('test@example.com', 'password');
    });

    expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password'
    });
  });

  it('should handle sign in error', async () => {
    const mockError = new Error('Invalid credentials');
    (supabase.auth.signInWithPassword as any).mockRejectedValue(mockError);

    const { result } = renderHook(() => 
      useAuthMethods({ 
        user: null, 
        loading: false, 
        setUser: mockSetUser 
      })
    );

    await expect(
      result.current.signIn('test@example.com', 'wrong-password')
    ).rejects.toThrow('Invalid credentials');
  });

  // Similar tests for signUp, signInWithGoogle, signInWithApple, and signOut...
});