import { Image, StyleSheet, View } from 'react-native';

import { spacing } from '@/constants/theme';

const logoSource = require('@/assets/images/futarch-logo.png');

export default function BrandLogo() {
  return (
    <View style={styles.wrap}>
      <Image
        source={logoSource}
        style={styles.logo}
        resizeMode="contain"
        accessibilityLabel="FutarchyVC"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  logo: {
    width: 280,
    height: 56,
    maxWidth: '92%',
  },
});
