'use client';

import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { useRouter } from '@/navigation';
import { users as mockUsers, type User } from '@/lib/data';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (email: string, password: string) => Promise<boolean>;
  updateUserIframe: (userId: string, iframeUrl: string | null) => void;
  allUsers: User[];
}

export const AuthContext = createContext<AuthContextType | null>(null);

// NOTE: This is a mock auth provider. In a real app, you'd use a service like
// Firebase Auth, NextAuth.js, or a custom backend. User data is not persisted
// beyond the client-side session and will be lost on a hard refresh of the data source.
let usersData = [...mockUsers];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(usersData);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsedUser: User = JSON.parse(storedUser);
        // re-validate user against our mock data
        const validUser = users.find((u) => u.id === parsedUser.id);
        if (validUser) {
          setUser(validUser);
        } else {
          // User in local storage is not in our data source, log them out
          localStorage.removeItem('user');
        }
      }
    } catch (error) {
      console.error('Failed to parse user from localStorage', error);
      localStorage.removeItem('user');
    }
    setLoading(false);
  }, []);

  const login = useCallback(
    async (email: string, password: string): Promise<boolean> => {
      const foundUser = users.find(
        (u) => u.email === email && u.password === password
      );
      if (foundUser) {
        const { password: _, ...userToStore } = foundUser;
        setUser(userToStore);
        localStorage.setItem('user', JSON.stringify(userToStore));
        return true;
      }
      return false;
    },
    [users]
  );

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('user');
    router.push('/login');
  }, [router]);

  const register = useCallback(
    async (email: string, password: string): Promise<boolean> => {
      if (users.some((u) => u.email === email)) {
        return false; // User already exists
      }
      const newUser: User = {
        id: String(Date.now()),
        email,
        password,
        role: 'user',
        iframeUrl: null,
      };
      
      usersData.push(newUser);
      setUsers(usersData);
      
      const { password: _, ...userToStore } = newUser;
      setUser(userToStore);
      localStorage.setItem('user', JSON.stringify(userToStore));
      return true;
    },
    [users]
  );

  const updateUserIframe = useCallback(
    (userId: string, iframeUrl: string | null) => {
      usersData = usersData.map((u) =>
        u.id === userId ? { ...u, iframeUrl } : u
      );
      setUsers(usersData);

      if (user && user.id === userId) {
        const updatedCurrentUser = { ...user, iframeUrl };
        setUser(updatedCurrentUser);
        localStorage.setItem('user', JSON.stringify(updatedCurrentUser));
      }
    },
    [user]
  );

  if (loading) {
    return null; // or a loading spinner
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        register,
        allUsers: users,
        updateUserIframe,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
