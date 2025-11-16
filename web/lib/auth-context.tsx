'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode
} from 'react';
import { API_BASE_URL } from './config';
import { clearAccessToken, setAccessToken, getAccessToken } from './auth-storage';
import toast from 'react-hot-toast';

type User = { id: number; email: string };

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  login: (params: { email: string; password: string }) => Promise<boolean>;
  register: (params: { email: string; password: string }) => Promise<boolean>;
  logout: () => Promise<void>;
};


const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getAccessToken();
    // For brevity we don't call /me; dashboard just handles 401 gracefully.
    if (!token) {
      setUser(null);
    }
    setLoading(false);
  }, []);

  const login = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<boolean> => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      let data: any = {};
      try {
        data = await res.json();
      } catch {
        // ignore parse errors
      }

      if (!res.ok) {
        const msg =
          data?.message ||
          (res.status === 401
            ? 'Invalid email or password'
            : 'Login failed');
        toast.error(msg);
        return false;
      }

      const { user, accessToken } = data as {
        user: User;
        accessToken: string;
      };

      setAccessToken(accessToken);
      setUser(user);
      toast.success('Logged in');
      return true;
    } catch (err: any) {
      console.error('Login error:', err);
      // Browser fetch throws TypeError on network error (like connection refused)
      const msg =
        err?.name === 'TypeError'
          ? 'Cannot reach server. Is backend running on port 4000?'
          : err?.message || 'Login failed';
      toast.error(msg);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<boolean> => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      let data: any = {};
      try {
        data = await res.json();
      } catch {
        // ignore parse errors
      }

      if (!res.ok) {
        const msg =
          data?.message ||
          (res.status === 400 ? 'Email already in use' : 'Registration failed');
        toast.error(msg);
        return false;
      }

      const { user, accessToken } = data as {
        user: User;
        accessToken: string;
      };

      setAccessToken(accessToken);
      setUser(user);
      toast.success('Account created');
      return true;
    } catch (err: any) {
      console.error('Register error:', err);
      const msg =
        err?.name === 'TypeError'
          ? 'Cannot reach server. Is backend running on port 4000?'
          : err?.message || 'Registration failed';
      toast.error(msg);
      return false;
    } finally {
      setLoading(false);
    }
  };


  const logout = async () => {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include'
      });
    } catch {
      // ignore network errors; still clear local auth state
    } finally {
      clearAccessToken();
      setUser(null);
      toast.success('Logged out');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
