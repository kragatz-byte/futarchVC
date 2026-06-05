import { useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import AccordionSection from '@/components/AccordionSection';
import DcfScenarioBlock from '@/components/DcfScenarioBlock';
import DetailSectionHeader from '@/components/DetailSectionHeader';
import FeedActionButton from '@/components/FeedActionButton';
import StartupOverviewCard from '@/components/StartupOverviewCard';
import StartupScoreCorner from '@/components/StartupScoreCorner';
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
import { brandCopy } from '@/constants/copy';
import { useDecisions } from '@/contexts/DecisionContext';
import { useForecasts } from '@/contexts/ForecastContext';
import { border, palette } from '@/constants/colors';
import { radii, spacing } from '@/constants/theme';
import { formatPercent, formatRelativeDate } from '@/lib/format';
import { normalizeRouteParam } from '@/lib/routeParam';
import { subscribeStartupRefresh } from '@/lib/startupRefresh';
import { getDiligenceReportByStartupId } from '@/services/diligence';
import { getStartupById } from '@/services/startups';
import type { DiligenceReport, Startup } from '@/types';

export default function StartupDetailScreen() {
  const { id: rawId } = useLocalSearchParams<{ id: string | string[] }>();
  const id = normalizeRouteParam(rawId);
  const { openDecisionModal } = useDecisions();
  const { openForecastModal } = useForecasts();
  const [startup, setStartup] = useState<Startup | null>(null);
  const [diligence, setDiligence] = useState<DiligenceReport | null>(null);
  const [loading, setLoading] = useState(true);

  const loadStartup = useCallback(() => {
    if (!id) {
      setStartup(null);
      setDiligence(null);
      setLoading(false);
      return;
    }

    Promise.all([getStartupById(id), getDiligenceReportByStartupId(id)])
      .then(([startupData, diligenceData]) => {
        setStartup(startupData ?? null);
        setDiligence(diligenceData ?? null);
      })
      .catch(() => {
        setStartup(null);
        setDiligence(null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    setLoading(true);
    loadStartup();
  }, [loadStartup]);

  useEffect(() => {
    if (!id) return undefined;

    return subscribeStartupRefresh((startupId) => {
      if (startupId === id) {
        getStartupById(id)
          .then((data) => {
            if (data) setStartup(data);
          })
          .catch(() => undefined);
      }
    });
  }, [id]);

  if (loading) {
    return (
      <AppScreen>
        <LoadingState message="Opening diligence..." />
      </AppScreen>
    );
  }

  if (!startup) {
    return (
      <AppScreen>
        <Card>
          <CardTitle>Startup not found</CardTitle>
          <CardSubtitle>This opportunity may have been removed.</CardSubtitle>
        </Card>
      </AppScreen>
    );
  }

  return (
    <>
      <AppScreen scroll contentContainerStyle={styles.content}>
        <DetailSectionHeader
          eyebrow="Opportunity"
          title={startup.name}
          subtitle={brandCopy.feedMission}
        />
        <StartupOverviewCard startup={startup} />

        <DetailSectionHeader
          eyebrow="Research"
          title="AI diligence"
          subtitle="Structured memo + score (0–100). You still choose invest, pass, or forecast."
        />

        {diligence ? (
          <>
            <Card variant="feed" style={styles.diligenceHero}>
              <View style={styles.diligenceHeroRow}>
                <View style={styles.diligenceHeroCopy}>
                  <AppText variant="label" tone="muted">
                    Voter split · AI score
                  </AppText>
                  <AppText variant="caption" tone="muted" style={styles.generated}>
                    Generated {formatRelativeDate(diligence.generatedAt)}
                  </AppText>
                </View>
                {startup ? (
                  <StartupScoreCorner
                    aiScore={diligence.aiScore}
                    startup={startup}
                    size="lg"
                  />
                ) : (
                  <StartupScoreCorner
                    aiScore={diligence.aiScore}
                    startup={{ percentInvest: 0, percentPass: 0 }}
                    size="lg"
                  />
                )}
              </View>
            </Card>

            <AccordionSection title="Executive Summary" defaultExpanded>
              <ReportBody text={diligence.executiveSummary} />
            </AccordionSection>

            <AccordionSection title="Market Analysis">
              <ReportBody text={diligence.marketAnalysis} />
            </AccordionSection>

            <AccordionSection title="Competitor Analysis">
              <ReportBody text={diligence.competitorAnalysis} />
            </AccordionSection>

            <AccordionSection title="Bull Case (DCF)" tone="success" defaultExpanded>
              <ReportBody text={diligence.bullCase} tone="success" />
              {diligence.bullCaseDcf != null ? (
                <DcfScenarioBlock scenario={diligence.bullCaseDcf} tone="success" />
              ) : null}
            </AccordionSection>

            <AccordionSection title="Bear Case (DCF)" tone="warning">
              <ReportBody text={diligence.bearCase} tone="warning" />
              {diligence.bearCaseDcf != null ? (
                <DcfScenarioBlock scenario={diligence.bearCaseDcf} tone="warning" />
              ) : null}
            </AccordionSection>

            <AccordionSection title="Key Risks">
              <View style={styles.list}>
                {diligence.risks.map((risk) => (
                  <AppText key={risk} variant="body" tone="muted" style={styles.listItem}>
                    • {risk}
                  </AppText>
                ))}
              </View>
            </AccordionSection>

            <AccordionSection title="Investment Memo">
              <ReportBody text={diligence.investmentMemo} />
            </AccordionSection>

            <AccordionSection title="Suggested Questions">
              <View style={styles.list}>
                {diligence.suggestedQuestions.map((question) => (
                  <AppText key={question} variant="body" tone="muted" style={styles.listItem}>
                    • {question}
                  </AppText>
                ))}
              </View>
            </AccordionSection>
          </>
        ) : (
          <Card style={styles.card}>
            <CardTitle>Diligence unavailable</CardTitle>
            <CardSubtitle>AI diligence has not been generated for this startup yet.</CardSubtitle>
          </Card>
        )}

        <DetailSectionHeader
          eyebrow="Your move"
          title="Decide & forecast"
          subtitle="Your invest, pass, and forecast shape community signals."
        />

        <Card style={styles.actionsCard}>
          <PrimaryButton
            label="Invest"
            onPress={() => openDecisionModal(startup, { initialDecision: 'invest', mode: 'decision' })}
            fullWidth
          />
          <View style={styles.actionRow}>
            <FeedActionButton
              label="Pass"
              variant="muted"
              onPress={() => openDecisionModal(startup, { initialDecision: 'pass', mode: 'decision' })}
            />
            <FeedActionButton
              label="Watchlist"
              variant="outline"
              onPress={() => openDecisionModal(startup, { mode: 'watchlist' })}
            />
          </View>
          <SecondaryButton
            label="Submit Forecast"
            onPress={() => openForecastModal(startup)}
            fullWidth
          />
        </Card>

        <DetailSectionHeader
          eyebrow="Crowd"
          title="Community signals"
          subtitle="Live sentiment from student investors on FutarchyVC."
        />

        <Card variant="feed" style={styles.statsCard}>
          <View style={styles.statsGrid}>
            <StatTile label="Investing" value={formatPercent(startup.percentInvest)} tone="success" />
            <StatTile label="Passing" value={formatPercent(startup.percentPass)} tone="muted" />
            <StatTile
              label="Avg conviction"
              value={formatPercent(startup.averageConviction)}
              tone="accent"
            />
            <StatTile
              label="Avg forecast"
              value={formatPercent(startup.averageForecast)}
              tone="accent"
            />
          </View>
        </Card>
      </AppScreen>
    </>
  );
}

function ReportBody({
  text,
  tone = 'muted',
}: {
  text: string;
  tone?: 'muted' | 'success' | 'warning';
}) {
  return (
    <AppText variant="body" tone={tone} style={styles.reportBody}>
      {text}
    </AppText>
  );
}

function StatTile({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: 'success' | 'muted' | 'accent';
}) {
  return (
    <View style={styles.statTile}>
      <AppText variant="caption" tone="muted">
        {label}
      </AppText>
      <AppText
        variant="subtitle"
        tone={tone === 'accent' ? 'accent' : tone === 'success' ? 'success' : 'default'}>
        {value}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: spacing.xxl,
  },
  diligenceHero: {
    marginBottom: spacing.md,
    padding: spacing.md,
  },
  diligenceHeroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  diligenceHeroCopy: {
    flex: 1,
    gap: spacing.xs,
  },
  generated: {
    marginTop: spacing.xs,
  },
  reportBody: {
    lineHeight: 22,
  },
  list: {
    gap: spacing.sm,
  },
  listItem: {
    lineHeight: 22,
  },
  card: {
    marginBottom: spacing.lg,
  },
  actionsCard: {
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  actionRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  statsCard: {
    marginBottom: spacing.lg,
    padding: spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  statTile: {
    width: '48%',
    flexGrow: 1,
    backgroundColor: palette.offWhite,
    borderRadius: radii.md,
    padding: spacing.md,
    gap: spacing.xs,
    borderWidth: 1,
    borderColor: border.subtle,
  },
});
