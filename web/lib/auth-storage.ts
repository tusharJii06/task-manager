'use client';

let inMemoryAccessToken: string | null = null;
const STORAGE_KEY = 'tm_access_token';

export function setAccessToken(token: string) {
  inMemoryAccessToken = token;
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(STORAGE_KEY, token);
  }
}

export function getAccessToken(): string | null {
  if (inMemoryAccessToken) return inMemoryAccessToken;
  if (typeof window !== 'undefined') {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    inMemoryAccessToken = stored;
    return stored;
  }
  return null;
}

export function clearAccessToken() {
  inMemoryAccessToken = null;
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(STORAGE_KEY);
  }
}
