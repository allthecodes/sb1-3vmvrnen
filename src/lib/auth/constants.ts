export const AUTH_ERRORS = {
  INVALID_CREDENTIALS: 'Invalid login credentials',
  USER_EXISTS: 'User already registered',
  EMAIL_NOT_CONFIRMED: 'Email not confirmed',
  NETWORK_ERROR: 'Network error occurred',
  UNKNOWN_ERROR: 'An unknown error occurred'
} as const;

export const AUTH_ROUTES = {
  LOGIN: '/login',
  SIGNUP: '/signup',
  CALLBACK: '/auth/callback',
  DASHBOARD: '/dashboard'
} as const;

export const REDIRECT_KEY = 'auth_redirect_url';