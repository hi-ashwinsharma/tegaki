import React, { createContext, useContext, useState, useEffect } from 'react';
import type { UserProfile } from '../types/auth';
import { authenticateWithPasskey, registerPasskey } from '../services/passkeyService';
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';
import { auth, googleProvider, isFirebaseConfigured } from '../services/firebase';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithPasskey: () => Promise<void>;
  registerWithPasskey: (username: string, email: string) => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  registerWithEmail: (name: string, email: string, pass: string) => Promise<void>;
  resetPassword: (email: string) => Promise<boolean>;
  logout: () => void;
  updateBio: (bio: string) => void;
}

const AUTH_STORAGE_KEY = 'tegaki_current_user';

const DEFAULT_USER: UserProfile = {
  id: 'u-ashwin',
  name: 'Ashwin Sharma',
  username: 'ashwin',
  email: 'ashwin@tegaki.io',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  bio: 'Journaling thoughts in private, publishing craft in public.',
  authProvider: 'google',
  createdAt: Date.now() - 86400000 * 30,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem(AUTH_STORAGE_KEY);
    return saved ? JSON.parse(saved) : DEFAULT_USER;
  });

  // Listen to Firebase auth changes if configured
  useEffect(() => {
    if (!isFirebaseConfigured) return;

    const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
      if (fbUser) {
        const uProfile: UserProfile = {
          id: fbUser.uid,
          name: fbUser.displayName || fbUser.email?.split('@')[0] || 'Writer',
          username: (fbUser.displayName || fbUser.email?.split('@')[0] || 'writer')
            .toLowerCase()
            .replace(/\s+/g, '_'),
          email: fbUser.email || '',
          avatarUrl: fbUser.photoURL || undefined,
          authProvider: fbUser.providerData[0]?.providerId === 'google.com' ? 'google' : 'email',
          createdAt: Date.now(),
        };
        setUser(uProfile);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [user]);

  const loginWithGoogle = async () => {
    if (isFirebaseConfigured) {
      try {
        const res = await signInWithPopup(auth, googleProvider);
        const fbUser = res.user;
        const uProfile: UserProfile = {
          id: fbUser.uid,
          name: fbUser.displayName || 'Ashwin Sharma',
          username: (fbUser.displayName || 'ashwin').toLowerCase().replace(/\s+/g, '_'),
          email: fbUser.email || 'ashwin@gmail.com',
          avatarUrl: fbUser.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          authProvider: 'google',
          createdAt: Date.now(),
        };
        setUser(uProfile);
        return;
      } catch (err) {
        console.warn('Firebase Google Auth popup error, falling back:', err);
      }
    }

    // Offline / Demo fallback
    const googleUser: UserProfile = {
      id: 'u-google-' + Date.now().toString().slice(-4),
      name: 'Ashwin Sharma',
      username: 'ashwin',
      email: 'ashwin@gmail.com',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      bio: 'Writer & thinker.',
      authProvider: 'google',
      createdAt: Date.now(),
    };
    setUser(googleUser);
  };

  const loginWithPasskey = async () => {
    const result = await authenticateWithPasskey();
    if (result.success) {
      const passkeyUser: UserProfile = {
        id: 'u-pk-' + Date.now().toString().slice(-4),
        name: 'Passkey Writer',
        username: 'passkey_writer',
        email: result.email,
        authProvider: 'passkey',
        createdAt: Date.now(),
      };
      setUser(passkeyUser);
    }
  };

  const registerWithPasskey = async (username: string, email: string) => {
    const res = await registerPasskey(username, email);
    if (res.success) {
      const newUser: UserProfile = {
        id: 'u-pk-' + Date.now().toString().slice(-4),
        name: username,
        username: username.toLowerCase().replace(/\s+/g, '_'),
        email: email,
        authProvider: 'passkey',
        createdAt: Date.now(),
      };
      setUser(newUser);
    }
  };

  const loginWithEmail = async (email: string, pass: string) => {
    if (isFirebaseConfigured) {
      try {
        const res = await signInWithEmailAndPassword(auth, email, pass);
        const fbUser = res.user;
        const uProfile: UserProfile = {
          id: fbUser.uid,
          name: fbUser.displayName || email.split('@')[0] || 'Writer',
          username: (email.split('@')[0] || 'writer').toLowerCase(),
          email: fbUser.email || email,
          authProvider: 'email',
          createdAt: Date.now(),
        };
        setUser(uProfile);
        return;
      } catch (err) {
        console.warn('Firebase Email Sign-in error:', err);
      }
    }

    const emailUser: UserProfile = {
      id: 'u-email-' + Date.now().toString().slice(-4),
      name: email.split('@')[0] || 'Writer',
      username: (email.split('@')[0] || 'writer').toLowerCase(),
      email: email,
      authProvider: 'email',
      createdAt: Date.now(),
    };
    setUser(emailUser);
  };

  const registerWithEmail = async (name: string, email: string, pass: string) => {
    if (isFirebaseConfigured) {
      try {
        const res = await createUserWithEmailAndPassword(auth, email, pass);
        if (res.user) {
          await updateProfile(res.user, { displayName: name });
        }
        const uProfile: UserProfile = {
          id: res.user.uid,
          name: name,
          username: name.toLowerCase().replace(/\s+/g, '_'),
          email: email,
          authProvider: 'email',
          createdAt: Date.now(),
        };
        setUser(uProfile);
        return;
      } catch (err) {
        console.warn('Firebase Email Sign-up error:', err);
      }
    }

    const emailUser: UserProfile = {
      id: 'u-email-' + Date.now().toString().slice(-4),
      name: name,
      username: name.toLowerCase().replace(/\s+/g, '_'),
      email: email,
      authProvider: 'email',
      createdAt: Date.now(),
    };
    setUser(emailUser);
  };

  const resetPassword = async (email: string): Promise<boolean> => {
    if (isFirebaseConfigured) {
      try {
        await sendPasswordResetEmail(auth, email);
        return true;
      } catch (err) {
        console.warn('Firebase password reset error:', err);
      }
    }
    return true;
  };

  const logout = () => {
    if (isFirebaseConfigured) {
      firebaseSignOut(auth).catch(() => {});
    }
    setUser(null);
  };

  const updateBio = (bio: string) => {
    if (user) {
      setUser({ ...user, bio });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loginWithGoogle,
        loginWithPasskey,
        registerWithPasskey,
        loginWithEmail,
        registerWithEmail,
        resetPassword,
        logout,
        updateBio,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
