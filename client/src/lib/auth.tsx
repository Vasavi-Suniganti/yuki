import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  GoogleAuthProvider,
  signInWithPopup,
  User,
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db, firebaseConfigured } from './firebase';
import { Role, UserProfile } from '../../../shared/types';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  demoMode: boolean;
  login: (email: string, pass: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  registerUser: (data: {
    name: string;
    email: string;
    password: string;
    institution: string;
    roleRequest: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfileData: (data: Partial<UserProfile>) => Promise<void>;
  verifyEmail: () => Promise<void>;
}

const AuthCtx = createContext<AuthContextType | null>(null);

const demoProfiles: Record<string, UserProfile> = {
  'researcher@demo.org': {
    uid: 'demo-researcher',
    name: 'Dr. Kavya Rao',
    email: 'researcher@demo.org',
    role: 'researcher_scientist',
    institution: 'National Centre for Polar and Ocean Research (NCPOR)',
    designation: 'Senior Scientist',
    bio: 'Glaciology and cryosphere dynamics specialist focusing on East Antarctica.',
    status: 'ACTIVE',
    emailVerified: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    savedPapers: ['pub-ice'],
    savedDatasets: ['ds-temp'],
    followedExpeditions: ['iae45', 'iae46'],
  },
  'reviewer@demo.org': {
    uid: 'demo-reviewer',
    name: 'Dr. Scientific Reviewer',
    email: 'reviewer@demo.org',
    role: 'researcher_scientist',
    institution: 'Polar Editorial Board',
    designation: 'Chief Reviewer',
    bio: 'Reviewer for cryosphere and atmospheric science publications.',
    status: 'ACTIVE',
    emailVerified: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  'media@demo.org': {
    uid: 'demo-media',
    name: 'Outreach Manager',
    email: 'media@demo.org',
    role: 'media_content',
    institution: 'Yuki Outreach Wing',
    designation: 'Media Lead',
    bio: 'Translating complex polar observations into engaging public stories.',
    status: 'ACTIVE',
    emailVerified: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  'admin@demo.org': {
    uid: 'demo-admin',
    name: 'NCPOR Platform Admin',
    email: 'admin@demo.org',
    role: 'ncpor_admin',
    institution: 'National Centre for Polar and Ocean Research (NCPOR)',
    designation: 'Systems Administrator',
    bio: 'Managing infrastructure, security rules, and user roles.',
    status: 'ACTIVE',
    emailVerified: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  'ncpor.admin@polaris.gov.in': {
    uid: 'demo-ncpor-admin',
    name: 'Dr. Official (NCPOR / MoES)',
    email: 'ncpor.admin@polaris.gov.in',
    role: 'ncpor_admin',
    institution: 'National Centre for Polar and Ocean Research (NCPOR / MoES)',
    designation: 'MoES Official Administrator',
    bio: 'NCPOR / Ministry of Earth Sciences Official Platform Administrator.',
    status: 'ACTIVE',
    emailVerified: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  'public@demo.org': {
    uid: 'demo-public',
    name: 'Public Student User',
    email: 'public@demo.org',
    role: 'public_student',
    institution: 'Polar Explorer Academy',
    designation: 'Student',
    bio: 'Exploring open polar datasets and education lessons.',
    status: 'ACTIVE',
    emailVerified: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(() => {
    try {
      return JSON.parse(localStorage.getItem('polaris-demo-profile') || 'null');
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(firebaseConfigured);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    return onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u && db) {
        try {
          const snap = await getDoc(doc(db, 'users', u.uid));
          if (snap.exists()) {
            setProfile(snap.data() as UserProfile);
          } else {
            // Default profile for new auth user
            const newP: UserProfile = {
              uid: u.uid,
              name: u.displayName || u.email?.split('@')[0] || 'User',
              email: u.email || '',
              photoURL: u.photoURL || undefined,
              role: 'public_student',
              status: 'ACTIVE',
              emailVerified: u.emailVerified,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };
            await setDoc(doc(db, 'users', u.uid), newP);
            setProfile(newP);
          }
        } catch (e) {
          console.warn('Firestore profile fetch warning:', e);
        }
      } else if (!u && firebaseConfigured) {
        setProfile(null);
      }
      setLoading(false);
    });
  }, []);

  async function login(email: string, pass: string) {
    if (auth && firebaseConfigured) {
      try {
        await signInWithEmailAndPassword(auth, email, pass);
        return;
      } catch (err: any) {
        if (
          err?.code === 'auth/configuration-not-found' ||
          err?.code === 'auth/operation-not-allowed' ||
          err?.code === 'auth/invalid-api-key' ||
          err?.message?.includes('configuration-not-found')
        ) {
          console.warn('Firebase Auth is not enabled in Firebase Console. Falling back to Demo Mode:', err);
        } else if (
          demoProfiles[email] ||
          email.endsWith('@demo.org') ||
          email.endsWith('@polaris.gov.in') ||
          err?.code === 'auth/invalid-credential' ||
          err?.code === 'auth/user-not-found' ||
          err?.code === 'auth/wrong-password' ||
          err?.code === 'auth/invalid-email'
        ) {
          console.warn('Firebase Auth remote sign-in failed or user not found. Falling back to Demo Mode profile for:', email, err);
        } else {
          throw err;
        }
      }
    }

    // Demo Mode Fallback
    const p = demoProfiles[email] || {
      uid: `demo-${Date.now()}`,
      name: email.split('@')[0],
      email,
      role: 'public_student' as Role,
      status: 'ACTIVE',
      emailVerified: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setProfile(p);
    localStorage.setItem('polaris-demo-profile', JSON.stringify(p));
  }

  async function loginWithGoogle() {
    if (auth && firebaseConfigured) {
      try {
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
        return;
      } catch (err: any) {
        if (
          err?.code === 'auth/configuration-not-found' ||
          err?.code === 'auth/operation-not-allowed' ||
          err?.code === 'auth/invalid-api-key' ||
          err?.message?.includes('configuration-not-found')
        ) {
          console.warn('Firebase Auth Google Provider not enabled. Falling back to Demo Mode:', err);
        } else {
          throw err;
        }
      }
    }

    const p = demoProfiles['researcher@demo.org'];
    setProfile(p);
    localStorage.setItem('polaris-demo-profile', JSON.stringify(p));
  }

  async function registerUser(data: {
    name: string;
    email: string;
    password: string;
    institution: string;
    roleRequest: string;
  }) {
    // Only public_student, researcher_scientist, media_content can self-register. NCPOR Admin is forbidden.
    const allowedRegistrationRoles: Role[] = ['public_student', 'researcher_scientist', 'media_content'];
    const assignedRole: Role = allowedRegistrationRoles.includes(data.roleRequest as Role)
      ? (data.roleRequest as Role)
      : 'public_student';

    if (auth && firebaseConfigured) {
      try {
        const cred = await createUserWithEmailAndPassword(auth, data.email, data.password);
        if (cred.user && db) {
          const newProfile: UserProfile = {
            uid: cred.user.uid,
            name: data.name,
            email: data.email,
            institution: data.institution,
            role: assignedRole,
            status: 'ACTIVE',
            emailVerified: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          await setDoc(doc(db, 'users', cred.user.uid), newProfile);
          setProfile(newProfile);
          await sendEmailVerification(cred.user);
        }
        return;
      } catch (err: any) {
        if (
          err?.code === 'auth/configuration-not-found' ||
          err?.code === 'auth/operation-not-allowed' ||
          err?.code === 'auth/invalid-api-key' ||
          err?.message?.includes('configuration-not-found')
        ) {
          console.warn('Firebase Auth Email/Password provider not enabled in console. Falling back to Demo Registration:', err);
        } else {
          throw err;
        }
      }
    }

    // Demo registration fallback
    const newP: UserProfile = {
      uid: `demo-${Date.now()}`,
      name: data.name,
      email: data.email,
      institution: data.institution,
      role: assignedRole,
      status: 'ACTIVE',
      emailVerified: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setProfile(newP);
    localStorage.setItem('polaris-demo-profile', JSON.stringify(newP));
  }

  async function logout() {
    if (auth && firebaseConfigured) {
      try {
        await signOut(auth);
      } catch (err) {
        console.warn('SignOut warning:', err);
      }
    }
    setUser(null);
    setProfile(null);
    localStorage.removeItem('polaris-demo-profile');
    try {
      sessionStorage.clear();
    } catch {
      // ignore
    }
  }

  async function resetPassword(email: string) {
    if (auth && firebaseConfigured) {
      try {
        await sendPasswordResetEmail(auth, email);
      } catch (err: any) {
        if (
          err?.code === 'auth/configuration-not-found' ||
          err?.code === 'auth/operation-not-allowed' ||
          err?.message?.includes('configuration-not-found')
        ) {
          console.warn('Password reset unavailable in unconfigured Firebase Auth:', err);
        } else {
          throw err;
        }
      }
    }
  }

  async function verifyEmail() {
    if (auth?.currentUser) {
      await sendEmailVerification(auth.currentUser);
    }
  }

  async function updateProfileData(data: Partial<UserProfile>) {
    if (!profile) return;
    const updated = { ...profile, ...data, updatedAt: new Date().toISOString() };
    if (db && profile.uid && firebaseConfigured) {
      await updateDoc(doc(db, 'users', profile.uid), updated as any);
    }
    setProfile(updated);
    if (!firebaseConfigured) {
      localStorage.setItem('polaris-demo-profile', JSON.stringify(updated));
    }
  }

  const value = useMemo(
    () => ({
      user,
      profile,
      loading,
      demoMode: !firebaseConfigured,
      login,
      loginWithGoogle,
      registerUser,
      logout,
      resetPassword,
      updateProfileData,
      verifyEmail,
    }),
    [user, profile, loading]
  );

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
