import { StyleSheet, View, ViewStyle } from 'react-native';

import { AiScoreBadge, VoterSentimentBadge } from '@/components/ui';
import { spacing } from '@/constants/theme';
import type { Startup } from '@/types';

type StartupScoreCornerProps = {
  aiScore: number;
  startup: Pick<Startup, 'percentInvest' | 'percentPass'>;
  size?: 'md' | 'lg';
  style?: ViewStyle;
};

export default function StartupScoreCorner({
  aiScore,
  startup,
  size = 'md',
  style,
}: StartupScoreCornerProps) {
  return (
    <View style={[styles.row, style]}>
      <VoterSentimentBadge
        percentInvest={startup.percentInvest}
        percentPass={startup.percentPass}
        size={size}
      />
      <AiScoreBadge score={aiScore} size={size} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    flexShrink: 0,
  },
});
