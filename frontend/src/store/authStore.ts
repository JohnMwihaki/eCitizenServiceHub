import { create } from 'zustand';
import { User, Role } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isCitizen: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  setUser: (user: User) => void;
}

const savedToken = localStorage.getItem('ecitizen_token');
let savedUser: User | null = null;
try {
  const parsed = localStorage.getItem('ecitizen_user');
  if (parsed) savedUser = JSON.parse(parsed);
} catch {
  savedUser = null;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: savedUser,
  token: savedToken,
  isAuthenticated: Boolean(savedToken && savedUser),
  isAdmin: savedUser?.role === 'ADMIN',
  isCitizen: savedUser?.role === 'CITIZEN',

  login: (user: User, token: string) => {
    localStorage.setItem('ecitizen_token', token);
    localStorage.setItem('ecitizen_user', JSON.stringify(user));
    set({
      user,
      token,
      isAuthenticated: true,
      isAdmin: user.role === 'ADMIN',
      isCitizen: user.role === 'CITIZEN',
    });
  },

  logout: () => {
    localStorage.removeItem('ecitizen_token');
    localStorage.removeItem('ecitizen_user');
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isAdmin: false,
      isCitizen: false,
    });
  },

  setUser: (user: User) => {
    localStorage.setItem('ecitizen_user', JSON.stringify(user));
    set({
      user,
      isAdmin: user.role === 'ADMIN',
      isCitizen: user.role === 'CITIZEN',
    });
  },
}));
