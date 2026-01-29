'use client';

import { createContext } from 'react';
import type { User } from '@/lib/data';

type UpdateUserData = {
  firstName: string;
  lastName: string;
  email: string;
};

type UpdateUserByAdminData = {
  firstName: string;
  lastName: string;
  email: string;
  role: 'user' | 'admin';
};

export interface AuthContextType {
  user: User | null;
  isAuthLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string; user: User | null }>;
  logout: () => Promise<void>;
  register: (email: string, password: string) => Promise<{ success: boolean; message: string; user: User | null }>;
  updateUserIframe: (userId: string, iframeUrl: string | null) => Promise<{ success: boolean; message: string }>;
  updateUserProfile: (
    userId: string,
    data: UpdateUserData
  ) => Promise<{ success: boolean; message: string }>;
  updateUserByAdmin: (
    userId: string,
    data: UpdateUserByAdminData
  ) => Promise<{ success: boolean; message: string }>;
  completeInitialSetup: (
    userId: string,
    data: { firstName: string; lastName: string }
  ) => Promise<{ success: boolean; message: string }>;
  allUsers: User[];
  isUsersLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);
