import type { Session } from '@supabase/supabase-js';
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { DEMO_USER_ID } from '@/constants/auth';
import { loadDemoModeFlag, persistDemoModeFlag } from '@/lib/authStorage';
import { isForcedDemoMode } from '@/lib/demoMode';
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase';
import {
  createProfileForUser,
  signInWithEmail,
  signOutFromSupabase,
  signUpWithEmail,
  type SignUpParams,
} from '@/services/supabase/auth';
import { fetchProfileFromSupabase } from '@/services/supabase/queries';

type AuthContextValue = {
  isReady: boolean;
  isDemoMode: boolean;
  isSupabaseEnabled: boolean;
  session: Session | null;
  userId: string;
  fullName: string | null;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (params: SignUpParams) => Promise<{ error?: string; needsEmailConfirmation?: boolean }>;
  enterDemoMode: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isReady, setIsReady] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    let mounted = true;
    let unsubscribeAuth: (() => void) | undefined;

    (async () => {
      if (isForcedDemoMode()) {
        setIsDemoMode(true);
        await persistDemoModeFlag(true);
        setSession(null);
        if (mounted) setIsReady(true);
        return;
      }

      const demoFlag = await loadDemoModeFlag();
      if (!mounted) return;

      setIsDemoMode(demoFlag);

      const supabase = getSupabase();
      if (supabase) {
        const { data } = await supabase.auth.getSession();
        if (!mounted) return;

        setSession(data.session);
        if (data.session) {
          await ensureProfileFromSession(data.session);
        }

        const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
          setSession(nextSession);
          if (nextSession) {
            setIsDemoMode(false);
            void persistDemoModeFlag(false);
            void ensureProfileFromSession(nextSession);
          }
        });

        unsubscribeAuth = () => listener.subscription.unsubscribe();
      }

      if (mounted) setIsReady(true);
    })();

    return () => {
      mounted = false;
      unsubscribeAuth?.();
    };
  }, []);

  const userId = isDemoMode ? DEMO_USER_ID : (session?.user.id ?? DEMO_USER_ID);

  const fullName = useMemo(() => {
    if (isDemoMode) return null;
    const meta = session?.user.user_metadata;
    if (meta && typeof meta.full_name === 'string') return meta.full_name;
    return null;
  }, [isDemoMode, session]);

  const isAuthenticated = isDemoMode || Boolean(session);

  const signIn = useCallback(async (email: string, password: string) => {
    const result = await signInWithEmail(email, password);
    if (!result.error) {
      setIsDemoMode(false);
      await persistDemoModeFlag(false);
    }
    return result;
  }, []);

  const signUp = useCallback(async (params: SignUpParams) => {
    const result = await signUpWithEmail(params);
    if (!result.error && !result.needsEmailConfirmation) {
      setIsDemoMode(false);
      await persistDemoModeFlag(false);
    }
    return result;
  }, []);

  const enterDemoMode = useCallback(async () => {
    await signOutFromSupabase();
    setSession(null);
    setIsDemoMode(true);
    await persistDemoModeFlag(true);
  }, []);

  const signOut = useCallback(async () => {
    await signOutFromSupabase();
    setSession(null);

    if (isForcedDemoMode()) {
      setIsDemoMode(true);
      await persistDemoModeFlag(true);
      return;
    }

    setIsDemoMode(false);
    await persistDemoModeFlag(false);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      isReady,
      isDemoMode,
      isSupabaseEnabled: isSupabaseConfigured(),
      session,
      userId,
      fullName,
      isAuthenticated,
      signIn,
      signUp,
      enterDemoMode,
      signOut,
    }),
    [
      enterDemoMode,
      fullName,
      isAuthenticated,
      isDemoMode,
      isReady,
      session,
      signIn,
      signOut,
      signUp,
      userId,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

/** Ensures a profiles row exists after email-confirmation sign-in. */
export async function ensureProfileFromSession(session: Session): Promise<void> {
  const meta = session.user.user_metadata;
  const username =
    typeof meta?.username === 'string' ? meta.username : session.user.email?.split('@')[0] ?? 'user';
  const campus = typeof meta?.campus === 'string' ? meta.campus : '';
  const fullName =
    typeof meta?.full_name === 'string' ? meta.full_name : username;

  const existing = await fetchProfileFromSupabase(session.user.id);
  if (existing) return;

  await createProfileForUser({
    id: session.user.id,
    fullName,
    username,
    campus,
  });
}
