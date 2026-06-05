import { useRouter, useSegments } from 'expo-router';
import { ReactNode, useEffect } from 'react';

import { useAuth } from '@/contexts/AuthContext';

type AuthGateProps = {
  children: ReactNode;
};

export default function AuthGate({ children }: AuthGateProps) {
  const { isReady, isAuthenticated } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!isReady) return;

    const root = segments[0];
    const onAuthScreen = root === 'auth';
    const onRoot = !root;

    if (!isAuthenticated && !onAuthScreen) {
      router.replace('/auth');
      return;
    }

    if (isAuthenticated && (onAuthScreen || onRoot)) {
      router.replace('/feed');
    }
  }, [isAuthenticated, isReady, router, segments]);

  if (!isReady) {
    return null;
  }

  const root = segments[0];
  const onAuthScreen = root === 'auth';
  if (!isAuthenticated && !onAuthScreen) {
    return null;
  }

  return <>{children}</>;
}
