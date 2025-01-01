import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AuthHeader } from '../components/auth/AuthHeader';
import { SocialButtons } from '../components/auth/SocialButtons';
import { EmailForm } from '../components/auth/EmailForm';
import { getAuthErrorMessage } from '../lib/auth/validation';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signInWithGoogle, signInWithApple } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectToDashboard = () => {
    const redirectUrl = sessionStorage.getItem('redirectUrl') || '/dashboard';
    sessionStorage.removeItem('redirectUrl');
    navigate(redirectUrl, { replace: true });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await signIn(email, password);
      redirectToDashboard();
    } catch (err: any) {
      console.error('Login error:', err);
      setError(getAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (err: any) {
      console.error('Google sign in error:', err);
      setError('Failed to sign in with Google');
    }
  };

  const handleAppleSignIn = async () => {
    try {
      await signInWithApple();
    } catch (err: any) {
      console.error('Apple sign in error:', err);
      setError('Failed to sign in with Apple');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-sage-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <AuthHeader
          title="Sign in to your account"
          subtitle="Or"
          linkText="create a new account"
          linkTo="/signup"
        />

        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="text-sm text-red-700">{error}</div>
          </div>
        )}

        <SocialButtons
          onGoogleClick={handleGoogleSignIn}
          onAppleClick={handleAppleSignIn}
        />

        <EmailForm
          email={email}
          password={password}
          loading={loading}
          buttonText="Sign in with email"
          loadingText="Signing in..."
          onEmailChange={setEmail}
          onPasswordChange={setPassword}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}