'use client';

import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { useRouter } from '@/navigation';
import { users as mockUsers, type User } from '@/lib/data';

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

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<User | null>;
  logout: () => void;
  register: (email: string, password: string) => Promise<User | null>;
  updateUserIframe: (userId: string, iframeUrl: string | null) => void;
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
  ) => Promise<boolean>;
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
        const validUser = usersData.find((u) => u.id === parsedUser.id);
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
    async (email: string, password: string): Promise<User | null> => {
      const foundUser = usersData.find(
        (u) => u.email === email && u.password === password
      );
      if (foundUser) {
        const { password: _, ...userToStore } = foundUser;
        setUser(userToStore);
        localStorage.setItem('user', JSON.stringify(userToStore));
        return userToStore;
      }
      return null;
    },
    []
  );

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('user');
    router.push('/login');
  }, [router]);

  const register = useCallback(
    async (email: string, password: string): Promise<User | null> => {
      if (usersData.some((u) => u.email === email)) {
        return null; // User already exists
      }
      const newUser: User = {
        id: String(Date.now()),
        email,
        password,
        role: 'user',
        iframeUrl: null,
        firstName: '',
        lastName: '',
        hasCompletedSetup: false,
      };
      
      usersData.push(newUser);
      setUsers(usersData);
      
      const { password: _, ...userToStore } = newUser;
      setUser(userToStore);
      localStorage.setItem('user', JSON.stringify(userToStore));
      return userToStore;
    },
    []
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
  
  const updateUserProfile = useCallback(
    async (
      userId: string,
      data: UpdateUserData
    ): Promise<{ success: boolean; message: string }> => {
      // Check for email uniqueness if it has changed
      if (usersData.some((u) => u.email === data.email && u.id !== userId)) {
        return { success: false, message: 'emailInUseError' };
      }

      usersData = usersData.map((u) =>
        u.id === userId ? { ...u, ...data } : u
      );
      setUsers(usersData);

      if (user && user.id === userId) {
        const updatedCurrentUser = { ...user, ...data };
        setUser(updatedCurrentUser);
        localStorage.setItem('user', JSON.stringify(updatedCurrentUser));
      }
      return { success: true, message: 'success' };
    },
    [user]
  );

  const updateUserByAdmin = useCallback(
    async (
      userId: string,
      data: UpdateUserByAdminData
    ): Promise<{ success: boolean; message: string }> => {
      // Check for email uniqueness if it has changed
      if (usersData.some((u) => u.email === data.email && u.id !== userId)) {
        return { success: false, message: 'emailInUseError' };
      }

      usersData = usersData.map((u) =>
        u.id === userId ? { ...u, ...data } : u
      );
      setUsers([...usersData]);

      if (user && user.id === userId) {
        const updatedCurrentUser = { ...user, ...data };
        setUser(updatedCurrentUser);
        localStorage.setItem('user', JSON.stringify(updatedCurrentUser));
      }
      return { success: true, message: 'success' };
    },
    [user]
  );
  
  const completeInitialSetup = useCallback(
    async (
      userId: string,
      data: { firstName: string; lastName: string }
    ): Promise<boolean> => {
      usersData = usersData.map((u) =>
        u.id === userId ? { ...u, ...data, hasCompletedSetup: true } : u
      );
      setUsers(usersData);

      if (user && user.id === userId) {
        const updatedCurrentUser = { ...user, ...data, hasCompletedSetup: true };
        setUser(updatedCurrentUser);
        localStorage.setItem('user', JSON.stringify(updatedCurrentUser));
      }
      return true;
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
        updateUserProfile,
        updateUserByAdmin,
        completeInitialSetup,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
