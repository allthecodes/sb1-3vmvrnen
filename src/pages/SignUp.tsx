import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AuthHeader } from '../components/auth/AuthHeader';
import { EmailForm } from '../components/auth/EmailForm';
import { PasswordValidationHints } from '../components/auth/PasswordValidation';
import { validatePassword, getAuthErrorMessage } from '../lib/auth/validation';
import type { PasswordValidation } from '../lib/auth/validation';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validation, setValidation] = useState<PasswordValidation>({ isValid: false, errors: [] });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setValidation(validatePassword(password));
  }, [password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const validation = validatePassword(password);
    if (!validation.isValid) {
      setError('Please fix the password issues before continuing');
      return;
    }

    setLoading(true);
    
    try {
      await signUp(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Signup error:', err);
      setError(getAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-sage-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <AuthHeader
          title="Create your account"
          subtitle="Or"
          linkText="sign in to your existing account"
          linkTo="/login"
        />

        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="text-sm text-red-700">{error}</div>
          </div>
        )}

        <EmailForm
          email={email}
          password={password}
          loading={loading}
          buttonText="Sign up with email"
          loadingText="Creating account..."
          onEmailChange={setEmail}
          onPasswordChange={setPassword}
          onSubmit={handleSubmit}
        />

        <PasswordValidationHints validation={validation} />
      </div>
    </div>
  );
}