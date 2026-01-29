'use client';

import React, { useCallback, useMemo } from 'react';
import { useRouter } from '@/navigation';
import type { User } from '@/lib/data';
import {
  AuthContext,
  AuthContextType,
} from '@/context/auth-context';
import {
  useUser,
  useAuth as useFirebaseAuth,
  useFirestore,
  useDoc,
  useMemoFirebase,
  setDocumentNonBlocking,
  updateDocumentNonBlocking,
} from '@/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { doc } from 'firebase/firestore';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const auth = useFirebaseAuth();
  const firestore = useFirestore();
  const {
    user: authUser,
    isUserLoading: isAuthLoading,
    userError,
  } = useUser();

  const userDocRef = useMemoFirebase(() => {
    if (!authUser) return null;
    return doc(firestore, 'users', authUser.uid);
  }, [firestore, authUser]);
  const { data: userProfile, isLoading: isProfileLoading } = useDoc<User>(userDocRef);

  const user = useMemo<User | null>(() => {
    if (!authUser || !userProfile) return null;
    return {
      id: authUser.uid,
      ...userProfile
    };
  }, [authUser, userProfile]);

  const getErrorMessage = (errorCode: string): string => {
    switch (errorCode) {
      case 'auth/email-already-in-use':
        return 'This email address is already in use.';
      case 'auth/invalid-email':
        return 'The email address is not valid.';
      case 'auth/operation-not-allowed':
        return 'Email/password accounts are not enabled.';
      case 'auth/weak-password':
        return 'The password is too weak.';
      case 'auth/user-disabled':
        return 'This user account has been disabled.';
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        return 'Invalid email or password.';
      default:
        return 'An unexpected error occurred. Please try again.';
    }
  };

  const login: AuthContextType['login'] = useCallback(
    async (email, password) => {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const userDoc = doc(firestore, 'users', userCredential.user.uid);
        // This is a bit of a hack, we should get the user doc after login
        // but for now we optimistically assume the user exists
        return { success: true, message: 'Login successful', user: {id: userCredential.user.uid, email } as User};
      } catch (error: any) {
        return { success: false, message: getErrorMessage(error.code), user: null };
      }
    },
    [auth, firestore]
  );

  const logout: AuthContextType['logout'] = useCallback(async () => {
    await signOut(auth);
    router.push('/login');
  }, [auth, router]);

  const register: AuthContextType['register'] = useCallback(
    async (email, password) => {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const newUser: Omit<User, 'id'> = {
            email,
            role: 'user',
            iframeUrl: null,
            firstName: '',
            lastName: '',
            hasCompletedSetup: false,
        };
        const userDocRef = doc(firestore, 'users', userCredential.user.uid);
        setDocumentNonBlocking(userDocRef, newUser, { merge: false });
        return { success: true, message: 'Registration successful', user: {id: userCredential.user.uid, ...newUser }};
      } catch (error: any) {
        return { success: false, message: getErrorMessage(error.code), user: null };
      }
    },
    [auth, firestore]
  );
  
  const updateUserIframe: AuthContextType['updateUserIframe'] = useCallback(async (userId, iframeUrl) => {
      try {
        const userDocRef = doc(firestore, 'users', userId);
        updateDocumentNonBlocking(userDocRef, { iframeUrl });
        return { success: true, message: 'Iframe URL updated.' };
      } catch (error: any) {
        return { success: false, message: 'Failed to update Iframe URL.' };
      }
    }, [firestore]);

  const updateUserProfile: AuthContextType['updateUserProfile'] = useCallback(async (userId, data) => {
      try {
        const userDocRef = doc(firestore, 'users', userId);
        updateDocumentNonBlocking(userDocRef, data);
        return { success: true, message: 'Profile updated.' };
      } catch (error: any) {
        return { success: false, message: 'Failed to update profile.' };
      }
    }, [firestore]);
    
  const updateUserByAdmin: AuthContextType['updateUserByAdmin'] = useCallback(async (userId, data) => {
      try {
        const userDocRef = doc(firestore, 'users', userId);
        updateDocumentNonBlocking(userDocRef, data);
        return { success: true, message: 'User updated.' };
      } catch (error: any) {
        return { success: false, message: 'Failed to update user.' };
      }
    }, [firestore]);
    
  const completeInitialSetup: AuthContextType['completeInitialSetup'] = useCallback(async (userId, data) => {
      try {
        const userDocRef = doc(firestore, 'users', userId);
        updateDocumentNonBlocking(userDocRef, { ...data, hasCompletedSetup: true });
        return { success: true, message: 'Setup complete.' };
      } catch (error: any) {
        return { success: false, message: 'Failed to complete setup.' };
      }
    }, [firestore]);


  const value = useMemo(
    () => ({
      user,
      isAuthLoading: isAuthLoading || isProfileLoading,
      login,
      logout,
      register,
      updateUserIframe,
      updateUserProfile,
      updateUserByAdmin,
      completeInitialSetup,
    }),
    [
      user,
      isAuthLoading,
      isProfileLoading,
      login,
      logout,
      register,
      updateUserIframe,
      updateUserProfile,
      updateUserByAdmin,
      completeInitialSetup,
    ]
  );

  if (userError) {
    // Handle auth error, maybe show a global error message
    console.error("Authentication Error:", userError);
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
