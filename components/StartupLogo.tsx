import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui';
import { navy, palette } from '@/constants/colors';
import { getStartupDisplaySymbol } from '@/lib/startupSymbol';
import { getInitials } from '@/lib/format';

type StartupLogoProps = {
  name: string;
  startupId?: string;
  industry?: string;
  logoUrl?: string;
  size?: 'sm' | 'md' | 'lg';
};

const sizes = {
  sm: { container: 40, emoji: 22, fontSize: 14 },
  md: { container: 52, emoji: 28, fontSize: 18 },
  lg: { container: 64, emoji: 34, fontSize: 22 },
} as const;

export default function StartupLogo({
  name,
  startupId,
  industry = '',
  logoUrl,
  size = 'md',
}: StartupLogoProps) {
  const dimensions = sizes[size];
  const symbol =
    startupId != null
      ? getStartupDisplaySymbol({ id: startupId, industry, logoUrl })
      : null;

  return (
    <View
      style={[
        styles.logo,
        {
          width: dimensions.container,
          height: dimensions.container,
          borderRadius: dimensions.container / 3.25,
        },
      ]}>
      {symbol ? (
        <AppText style={[styles.emoji, { fontSize: dimensions.emoji }]}>{symbol}</AppText>
      ) : (
        <AppText variant="subtitle" tone="inverse" style={{ fontSize: dimensions.fontSize }}>
          {getInitials(name)}
        </AppText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  logo: {
    backgroundColor: navy[700],
    borderWidth: 2,
    borderColor: palette.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    lineHeight: undefined,
    textAlign: 'center',
  },
});
