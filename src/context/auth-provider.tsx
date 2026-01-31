'use client';

import React, { useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
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
  GoogleAuthProvider,
  signInWithPopup,
  unlink,
  linkWithPopup,
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

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
      providerData: authUser.providerData,
      ...userProfile
    };
  }, [authUser, userProfile]);

  const getErrorMessage = (errorCode: string): string => {
    switch (errorCode) {
      case 'auth/email-already-in-use':
        return 'Diese E-Mail-Adresse wird bereits verwendet.';
      case 'auth/invalid-email':
        return 'Die E-Mail-Adresse ist ungültig.';
      case 'auth/operation-not-allowed':
        return 'Sie können nicht Ihre einzige Anmeldemethode entfernen.';
      case 'auth/weak-password':
        return 'Das Passwort ist zu schwach.';
      case 'auth/user-disabled':
        return 'Dieses Benutzerkonto wurde deaktiviert.';
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        return 'Ungültige E-Mail oder Passwort.';
      case 'auth/account-exists-with-different-credential':
        return 'Ein Konto mit derselben E-Mail-Adresse, aber unterschiedlichen Anmeldeinformationen existiert bereits.';
      case 'auth/requires-recent-login':
        return 'Dieser Vorgang ist sensibel und erfordert eine kürzliche Authentifizierung. Bitte melden Sie sich erneut an, bevor Sie es erneut versuchen.'
      case 'auth/credential-already-in-use':
        return 'Dieses Google-Konto ist bereits mit einem anderen Benutzer verknüpft.';
      case 'auth/unauthorized-domain':
        return 'Diese Domain ist nicht für die Authentifizierung autorisiert. Fügen Sie sie in den Firebase-Konsoleneinstellungen hinzu.';
      default:
        return 'Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es erneut.';
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
  
  const loginWithGoogle: AuthContextType['loginWithGoogle'] = useCallback(async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: 'select_account'
    });
    try {
      const result = await signInWithPopup(auth, provider);
      const gUser = result.user;
      const userDocRef = doc(firestore, 'users', gUser.uid);
      const userDocSnap = await getDoc(userDocRef);

      let appUser: User;

      if (userDocSnap.exists()) {
        appUser = { id: gUser.uid, ...userDocSnap.data() } as User;
      } else {
        const displayName = gUser.displayName || '';
        const nameParts = displayName.split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
        
        const newUser: Omit<User, 'id'> = {
          email: gUser.email!,
          role: 'user',
          iframeUrl: null,
          firstName,
          lastName,
          hasCompletedSetup: !!(firstName && lastName),
        };

        setDocumentNonBlocking(userDocRef, newUser, { merge: false });
        appUser = { id: gUser.uid, ...newUser };
      }

      return { success: true, message: 'Login successful', user: appUser };
    } catch (error: any) {
      return { success: false, message: getErrorMessage(error.code), user: null };
    }
  }, [auth, firestore]);

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

  const unlinkGoogleProvider: AuthContextType['unlinkGoogleProvider'] = useCallback(async () => {
    if (!auth.currentUser) {
      return { success: false, message: 'You must be logged in to perform this action.' };
    }

    const googleProvider = auth.currentUser.providerData.find(
      (p) => p.providerId === 'google.com'
    );
    
    if (!googleProvider) {
       return { success: false, message: 'Google account is not linked.' };
    }

    if (auth.currentUser.providerData.length === 1) {
      return { success: false, message: 'You cannot unlink your only sign-in method.' };
    }

    try {
      await unlink(auth.currentUser, 'google.com');
      return { success: true, message: 'Google account unlinked successfully.' };
    } catch (error: any) {
      return { success: false, message: getErrorMessage(error.code) };
    }
  }, [auth]);

  const linkGoogleProvider: AuthContextType['linkGoogleProvider'] = useCallback(async () => {
    if (!auth.currentUser) {
      return { success: false, message: 'You must be logged in to perform this action.' };
    }

    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: 'select_account'
    });

    try {
      await linkWithPopup(auth.currentUser, provider);
      return { success: true, message: 'Google account linked successfully.' };
    } catch (error: any) {
      return { success: false, message: getErrorMessage(error.code) };
    }
  }, [auth]);

  const value = useMemo(
    () => ({
      user,
      isAuthLoading: isAuthLoading || isProfileLoading,
      login,
      loginWithGoogle,
      logout,
      register,
      updateUserIframe,
      updateUserProfile,
      updateUserByAdmin,
      completeInitialSetup,
      unlinkGoogleProvider,
      linkGoogleProvider,
    }),
    [
      user,
      isAuthLoading,
      isProfileLoading,
      login,
      loginWithGoogle,
      logout,
      register,
      updateUserIframe,
      updateUserProfile,
      updateUserByAdmin,
      completeInitialSetup,
      unlinkGoogleProvider,
      linkGoogleProvider,
    ]
  );

  if (userError) {
    // Handle auth error, maybe show a global error message
    console.error("Authentication Error:", userError);
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
