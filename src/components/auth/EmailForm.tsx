import React from 'react';
import { Mail } from 'lucide-react';

interface EmailFormProps {
  email: string;
  password: string;
  loading: boolean;
  buttonText: string;
  loadingText: string;
  onEmailChange: (email: string) => void;
  onPasswordChange: (password: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function EmailForm({
  email,
  password,
  loading,
  buttonText,
  loadingText,
  onEmailChange,
  onPasswordChange,
  onSubmit
}: EmailFormProps) {
  return (
    <form className="mt-8 space-y-6" onSubmit={onSubmit}>
      <div className="rounded-md shadow-sm -space-y-px">
        <div>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-sage-300 placeholder-sage-500 text-sage-900 rounded-t-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
            placeholder="Email address"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            disabled={loading}
          />
        </div>
        <div>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-sage-300 placeholder-sage-500 text-sage-900 rounded-b-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
            placeholder="Password"
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            disabled={loading}
          />
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={loading}
          className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
        >
          <Mail className="h-4 w-4 mr-2" />
          {loading ? loadingText : buttonText}
        </button>
      </div>
    </form>
  );
}