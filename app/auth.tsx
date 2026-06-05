import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';

import CampusPicker from '@/components/CampusPicker';
import FormField from '@/components/FormField';
import {
  AppScreen,
  AppText,
  Card,
  CardSubtitle,
  CardTitle,
  LoadingState,
  PrimaryButton,
  SecondaryButton,
} from '@/components/ui';
import { useAuth } from '@/contexts/AuthContext';
import { isForcedDemoMode } from '@/lib/demoMode';
import { palette, text } from '@/constants/colors';
import { radii, spacing } from '@/constants/theme';
import { validateLoginForm, validateSignupForm } from '@/lib/validateAuth';

type AuthMode = 'login' | 'signup';

const EMPTY_FORM = {
  email: '',
  password: '',
  fullName: '',
  username: '',
  campus: '',
};

export default function AuthScreen() {
  const router = useRouter();
  const { isSupabaseEnabled, signIn, signUp, enterDemoMode, isAuthenticated, isReady } =
    useAuth();
  const [mode, setMode] = useState<AuthMode>('login');
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<typeof EMPTY_FORM>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isReady || isAuthenticated || !isForcedDemoMode()) return;

    (async () => {
      setLoading(true);
      try {
        await enterDemoMode();
        router.replace('/feed');
      } finally {
        setLoading(false);
      }
    })();
  }, [enterDemoMode, isAuthenticated, isReady, router]);

  if (isAuthenticated) {
    return null;
  }

  if (isForcedDemoMode() && (!isReady || loading)) {
    return (
      <AppScreen>
        <LoadingState message="Starting demo mode..." />
      </AppScreen>
    );
  }

  const updateField = (key: keyof typeof EMPTY_FORM, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const handleDemoMode = async () => {
    setLoading(true);
    try {
      await enterDemoMode();
      router.replace('/feed');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!isSupabaseEnabled) {
      Alert.alert(
        'Demo mode only',
        'Add EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY to use email auth.'
      );
      return;
    }

    if (mode === 'login') {
      const { errors: validationErrors, valid } = validateLoginForm(form);
      if (!valid) {
        setErrors(validationErrors);
        return;
      }

      setLoading(true);
      const result = await signIn(form.email, form.password);
      setLoading(false);

      if (result.error) {
        Alert.alert('Sign in failed', result.error);
        return;
      }

      router.replace('/feed');
      return;
    }

    const { errors: validationErrors, valid } = validateSignupForm(form);
    if (!valid) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    const result = await signUp({
      email: form.email,
      password: form.password,
      fullName: form.fullName,
      username: form.username,
      campus: form.campus,
    });
    setLoading(false);

    if (result.error) {
      Alert.alert('Sign up failed', result.error);
      return;
    }

    if (result.needsEmailConfirmation) {
      Alert.alert(
        'Confirm your email',
        'We sent a confirmation link. Open it, then sign in here.',
        [{ text: 'OK', onPress: () => setMode('login') }]
      );
      return;
    }

    router.replace('/feed');
  };

  return (
    <AppScreen scroll contentContainerStyle={styles.content}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboard}>
        <View style={styles.header}>
          <AppText variant="hero" tone="inverse">
            FutarchyVC
          </AppText>
          <AppText variant="body" tone="inverseMuted" style={styles.subtitle}>
            Campus startup investing practice — sign in or try the demo feed.
          </AppText>
        </View>

        {isSupabaseEnabled ? (
          <>
            <View style={styles.modeRow}>
              <Pressable
                onPress={() => setMode('login')}
                style={[styles.modeTab, mode === 'login' && styles.modeTabActive]}>
                <AppText variant="subtitle" tone={mode === 'login' ? 'inverse' : 'inverseMuted'}>
                  Log in
                </AppText>
              </Pressable>
              <Pressable
                onPress={() => setMode('signup')}
                style={[styles.modeTab, mode === 'signup' && styles.modeTabActive]}>
                <AppText variant="subtitle" tone={mode === 'signup' ? 'inverse' : 'inverseMuted'}>
                  Sign up
                </AppText>
              </Pressable>
            </View>

            <Card style={styles.formCard}>
              <CardTitle>{mode === 'login' ? 'Welcome back' : 'Create your account'}</CardTitle>
              <CardSubtitle>
                {mode === 'login'
                  ? 'Use the email and password for your FutarchyVC account.'
                  : 'Join your campus investing community.'}
              </CardSubtitle>

              <View style={styles.fields}>
                {mode === 'signup' ? (
                  <>
                    <FormField
                      label="Full name"
                      value={form.fullName}
                      onChangeText={(value) => updateField('fullName', value)}
                      placeholder="Alex Rivera"
                      autoCapitalize="words"
                      error={errors.fullName}
                    />
                    <FormField
                      label="Username"
                      value={form.username}
                      onChangeText={(value) => updateField('username', value)}
                      placeholder="alex_r"
                      autoCapitalize="none"
                      autoCorrect={false}
                      error={errors.username}
                    />
                    <View style={styles.fieldBlock}>
                      <AppText variant="label" tone="muted">
                        Campus
                      </AppText>
                      <CampusPicker
                        value={form.campus}
                        onChange={(value) => updateField('campus', value)}
                        error={errors.campus}
                      />
                    </View>
                  </>
                ) : null}

                <FormField
                  label="Email"
                  value={form.email}
                  onChangeText={(value) => updateField('email', value)}
                  placeholder="you@university.edu"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  error={errors.email}
                />
                <FormField
                  label="Password"
                  value={form.password}
                  onChangeText={(value) => updateField('password', value)}
                  placeholder={mode === 'signup' ? 'At least 6 characters' : 'Your password'}
                  secureTextEntry
                  error={errors.password}
                />
              </View>

              <PrimaryButton
                label={mode === 'login' ? 'Log in' : 'Create account'}
                onPress={handleSubmit}
                loading={loading}
                fullWidth
                style={styles.primaryAction}
              />
            </Card>

            <SecondaryButton
              label="Continue in Demo Mode"
              variant="ghost"
              onPress={handleDemoMode}
              disabled={loading}
              fullWidth
            />
          </>
        ) : (
          <Card style={styles.formCard}>
            <CardTitle>Demo mode</CardTitle>
            <CardSubtitle>
              Supabase is not configured. Explore the app with mock startups and local saves.
            </CardSubtitle>
            <PrimaryButton
              label="Continue in Demo Mode"
              onPress={handleDemoMode}
              loading={loading}
              fullWidth
              style={styles.primaryAction}
            />
          </Card>
        )}
      </KeyboardAvoidingView>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: spacing.xxl,
  },
  keyboard: {
    gap: spacing.lg,
  },
  header: {
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  subtitle: {
    lineHeight: 22,
  },
  modeRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  modeTab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: text.inverseMuted,
  },
  modeTabActive: {
    backgroundColor: palette.accent,
    borderColor: palette.accent,
  },
  formCard: {
    gap: spacing.md,
  },
  fields: {
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  fieldBlock: {
    gap: spacing.xs,
  },
  primaryAction: {
    marginTop: spacing.sm,
  },
});
