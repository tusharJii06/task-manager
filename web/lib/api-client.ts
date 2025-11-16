'use client';

import { API_BASE_URL } from './config';
import { getAccessToken, setAccessToken, clearAccessToken } from './auth-storage';

async function refreshAccessToken(): Promise<string | null> {
  const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: 'POST',
    credentials: 'include'
  });

  if (!res.ok) {
    clearAccessToken();
    return null;
  }

  const data = (await res.json()) as { accessToken: string };
  setAccessToken(data.accessToken);
  return data.accessToken;
}

export async function apiFetch(
  input: string,
  init: RequestInit = {}
): Promise<Response> {
  const accessToken = getAccessToken();
  const headers = new Headers(init.headers || {});
  headers.set('Content-Type', 'application/json');
  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }

  let res = await fetch(`${API_BASE_URL}${input}`, {
    ...init,
    headers,
    credentials: 'include'
  });

  if (res.status === 401) {
    const newToken = await refreshAccessToken();
    if (!newToken) {
      return res;
    }

    headers.set('Authorization', `Bearer ${newToken}`);

    res = await fetch(`${API_BASE_URL}${input}`, {
      ...init,
      headers,
      credentials: 'include'
    });
  }

  return res;
}
