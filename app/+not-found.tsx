import { Stack, useRouter } from 'expo-router';

import { AppScreen, AppText, PrimaryButton } from '@/components/ui';
import { spacing } from '@/constants/theme';
import { StyleSheet } from 'react-native';

export default function NotFoundScreen() {
  const router = useRouter();

  return (
    <>
      <Stack.Screen options={{ title: 'Not Found' }} />
      <AppScreen style={styles.container}>
        <AppText variant="title" tone="inverse">
          This screen doesn't exist.
        </AppText>
        <PrimaryButton label="Back to Feed" onPress={() => router.replace('/feed')} />
      </AppScreen>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.lg,
  },
});
