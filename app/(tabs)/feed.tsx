import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';

import FeedHeader from '@/components/FeedHeader';
import ProductCapabilities from '@/components/ProductCapabilities';
import StartupCard, { StartupCardAction } from '@/components/StartupCard';
import { AppScreen, EmptyState, LoadingState } from '@/components/ui';
import { useDecisions } from '@/contexts/DecisionContext';
import { useForecasts } from '@/contexts/ForecastContext';
import { spacing } from '@/constants/theme';
import { subscribeStartupRefresh } from '@/lib/startupRefresh';
import { getStartups } from '@/services/startups';
import type { Startup } from '@/types';

export default function FeedScreen() {
  const router = useRouter();
  const { openDecisionModal } = useDecisions();
  const { openForecastModal } = useForecasts();
  const [startups, setStartups] = useState<Startup[]>([]);
  const [loading, setLoading] = useState(true);

  const loadStartups = useCallback(() => {
    setLoading(true);
    getStartups()
      .then((data) => setStartups(data))
      .catch(() => setStartups([]))
      .finally(() => setLoading(false));
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadStartups();
    }, [loadStartups])
  );

  useEffect(() => {
    return subscribeStartupRefresh(() => {
      loadStartups();
    });
  }, [loadStartups]);

  const openStartup = (startupId: string) => {
    router.push(`/startup/${startupId}`);
  };

  const handleAction = (startup: Startup, action: StartupCardAction) => {
    if (action === 'forecast') {
      openForecastModal(startup);
      return;
    }

    if (action === 'invest') {
      openDecisionModal(startup, { initialDecision: 'invest', mode: 'decision' });
      return;
    }

    openDecisionModal(startup, { initialDecision: 'pass', mode: 'decision' });
  };

  return (
    <AppScreen scroll contentContainerStyle={styles.content}>
      <FeedHeader opportunityCount={loading ? undefined : startups.length} />
      <ProductCapabilities />

      {loading ? (
        <LoadingState message="Loading your feed..." />
      ) : startups.length === 0 ? (
        <EmptyState
          title="Nothing in the feed yet"
          description="New campus startups land here after founders submit. Check back soon."
        />
      ) : (
        startups.map((startup) => (
          <StartupCard
            key={startup.id}
            startup={startup}
            onPress={() => openStartup(startup.id)}
            onViewDiligence={() => openStartup(startup.id)}
            onAction={(action) => handleAction(startup, action)}
          />
        ))
      )}
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: spacing.xxl,
  },
});
