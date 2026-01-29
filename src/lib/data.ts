// The User type is now based on the Firestore data structure.
// The mock user array has been removed as data is now fetched from Firebase.

export type User = {
  id: string; // This will be the Firebase Auth UID
  email: string;
  role: 'user' | 'admin';
  iframeUrl: string | null;
  firstName: string;
  lastName: string;
  hasCompletedSetup: boolean;
};
