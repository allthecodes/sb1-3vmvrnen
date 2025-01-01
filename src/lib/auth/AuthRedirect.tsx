import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { logger } from '../logging';
import { LOG_CATEGORIES } from '../logging/constants';

export function AuthRedirect() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading) {
      const destination = user ? '/dashboard' : '/login';
      logger.info(LOG_CATEGORIES.NAVIGATION, 'Redirecting user', {
        from: location.pathname,
        to: destination,
        isAuthenticated: !!user
      });
      navigate(destination, { replace: true });
    }
  }, [user, loading, navigate, location]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-sage-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return null;
}