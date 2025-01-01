import { REDIRECT_KEY } from './constants';

export function saveRedirectUrl(url: string) {
  sessionStorage.setItem(REDIRECT_KEY, url);
}

export function getRedirectUrl(): string {
  const url = sessionStorage.getItem(REDIRECT_KEY);
  sessionStorage.removeItem(REDIRECT_KEY);
  return url || '/dashboard';
}

export function clearRedirectUrl() {
  sessionStorage.removeItem(REDIRECT_KEY);
}