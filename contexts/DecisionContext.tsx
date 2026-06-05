/** Persists per-user invest/pass/watchlist; updates community aggregates on the feed. */
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  createDecisionId,
  createWatchlistId,
  loadStoredDecisions,
  persistDecisions,
  upsertDecision,
  upsertWatchlistEntry,
} from '@/lib/decisionStorage';
import { loadStoredForecasts } from '@/lib/forecastStorage';
import { useAuth } from '@/contexts/AuthContext';
import { isSupabaseConfigured } from '@/lib/supabase';
import { saveInvestmentDecisionToSupabase } from '@/services/supabase/decisions';
import {
  computeLocalStartupAggregates,
  type StartupAggregateStats,
} from '@/services/startupAggregates';
import { patchStartupInRegistry } from '@/services/startupRegistry';
import type { InvestmentDecision, InvestmentDecisionType, Startup, WatchlistEntry } from '@/types';

export type DecisionModalMode = 'decision' | 'watchlist';

type DecisionModalState = {
  visible: boolean;
  startup: Startup | null;
  mode: DecisionModalMode;
  initialDecision: InvestmentDecisionType | null;
};

type DecisionContextValue = {
  decisions: InvestmentDecision[];
  watchlist: WatchlistEntry[];
  modalState: DecisionModalState;
  toastMessage: string | null;
  openDecisionModal: (
    startup: Startup,
    options?: {
      initialDecision?: InvestmentDecisionType;
      mode?: DecisionModalMode;
    }
  ) => void;
  closeDecisionModal: () => void;
  submitDecision: (input: {
    decision: InvestmentDecisionType;
    conviction: number;
    reasoning?: string;
  }) => Promise<void>;
  submitWatchlist: (input: {
    lean?: InvestmentDecisionType;
    conviction: number;
    reasoning?: string;
  }) => Promise<void>;
  dismissToast: () => void;
  getDecisionForStartup: (startupId: string) => InvestmentDecision | undefined;
  isWatchlisted: (startupId: string) => boolean;
};

const initialModalState: DecisionModalState = {
  visible: false,
  startup: null,
  mode: 'decision',
  initialDecision: null,
};

const DEMO_CONFIRMATION =
  'Decision saved locally. Your forecasting reputation will update as outcomes resolve.';

const SUPABASE_CONFIRMATION =
  'Decision saved. Community stats updated on FutarchyVC.';

const SYNC_FAILED_CONFIRMATION =
  'Decision saved on this device. Cloud sync failed — try again later.';

const DecisionContext = createContext<DecisionContextValue | null>(null);

export function DecisionProvider({ children }: { children: ReactNode }) {
  const { userId, isDemoMode } = useAuth();
  const [decisions, setDecisions] = useState<InvestmentDecision[]>([]);
  const [watchlist, setWatchlist] = useState<WatchlistEntry[]>([]);
  const [modalState, setModalState] = useState<DecisionModalState>(initialModalState);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    loadStoredDecisions().then((stored) => {
      setDecisions(stored.decisions);
      setWatchlist(stored.watchlist);
    });
  }, []);

  const persist = useCallback(async (nextDecisions: InvestmentDecision[], nextWatchlist: WatchlistEntry[]) => {
    await persistDecisions({ decisions: nextDecisions, watchlist: nextWatchlist });
  }, []);

  const showConfirmation = useCallback((message: string) => {
    setToastMessage(message);
  }, []);

  const dismissToast = useCallback(() => {
    setToastMessage(null);
  }, []);

  useEffect(() => {
    if (!toastMessage) return;

    const timer = setTimeout(() => {
      setToastMessage(null);
    }, 4000);

    return () => clearTimeout(timer);
  }, [toastMessage]);

  const applyLocalAggregateStats = useCallback(
    async (startupId: string, nextDecisions: InvestmentDecision[]) => {
      const forecasts = await loadStoredForecasts();
      const stats: StartupAggregateStats = computeLocalStartupAggregates(
        startupId,
        nextDecisions,
        forecasts
      );
      patchStartupInRegistry(startupId, stats);
    },
    []
  );

  const openDecisionModal = useCallback(
    (
      startup: Startup,
      options?: {
        initialDecision?: InvestmentDecisionType;
        mode?: DecisionModalMode;
      }
    ) => {
      setModalState({
        visible: true,
        startup,
        mode: options?.mode ?? 'decision',
        initialDecision: options?.initialDecision ?? null,
      });
    },
    []
  );

  const closeDecisionModal = useCallback(() => {
    setModalState(initialModalState);
  }, []);

  const submitDecision = useCallback(
    async (input: {
      decision: InvestmentDecisionType;
      conviction: number;
      reasoning?: string;
    }) => {
      if (!modalState.startup) return;

      const entry: InvestmentDecision = {
        id: createDecisionId(),
        startupId: modalState.startup.id,
        userId,
        decision: input.decision,
        conviction: input.conviction,
        reasoning: input.reasoning?.trim() || undefined,
        createdAt: new Date().toISOString(),
      };

      const nextDecisions = upsertDecision(decisions, entry);
      setDecisions(nextDecisions);
      await persist(nextDecisions, watchlist);

      const startupId = modalState.startup.id;

      if (isDemoMode || !isSupabaseConfigured()) {
        await applyLocalAggregateStats(startupId, nextDecisions);
        closeDecisionModal();
        showConfirmation(DEMO_CONFIRMATION);
        return;
      }

      const remote = await saveInvestmentDecisionToSupabase(entry);
      await applyLocalAggregateStats(startupId, nextDecisions);
      closeDecisionModal();
      showConfirmation(remote.ok ? SUPABASE_CONFIRMATION : SYNC_FAILED_CONFIRMATION);
    },
    [
      applyLocalAggregateStats,
      closeDecisionModal,
      decisions,
      isDemoMode,
      modalState.startup,
      persist,
      showConfirmation,
      userId,
      watchlist,
    ]
  );

  const submitWatchlist = useCallback(
    async (input: {
      lean?: InvestmentDecisionType;
      conviction: number;
      reasoning?: string;
    }) => {
      if (!modalState.startup) return;

      const entry: WatchlistEntry = {
        id: createWatchlistId(),
        startupId: modalState.startup.id,
        userId,
        lean: input.lean,
        conviction: input.conviction,
        reasoning: input.reasoning?.trim() || undefined,
        createdAt: new Date().toISOString(),
      };

      const nextWatchlist = upsertWatchlistEntry(watchlist, entry);
      setWatchlist(nextWatchlist);
      await persist(decisions, nextWatchlist);
      closeDecisionModal();
      showConfirmation(
        isDemoMode
          ? 'Added to your watchlist (saved locally).'
          : 'Added to your watchlist.'
      );
    },
    [closeDecisionModal, decisions, isDemoMode, modalState.startup, persist, showConfirmation, userId, watchlist]
  );

  const getDecisionForStartup = useCallback(
    (startupId: string) =>
      decisions.find((item) => item.startupId === startupId && item.userId === userId),
    [decisions, userId]
  );

  const isWatchlisted = useCallback(
    (startupId: string) =>
      watchlist.some((item) => item.startupId === startupId && item.userId === userId),
    [watchlist, userId]
  );

  const value = useMemo<DecisionContextValue>(
    () => ({
      decisions,
      watchlist,
      modalState,
      toastMessage,
      openDecisionModal,
      closeDecisionModal,
      submitDecision,
      submitWatchlist,
      dismissToast,
      getDecisionForStartup,
      isWatchlisted,
    }),
    [
      closeDecisionModal,
      decisions,
      dismissToast,
      getDecisionForStartup,
      isWatchlisted,
      modalState,
      openDecisionModal,
      submitDecision,
      submitWatchlist,
      toastMessage,
      watchlist,
    ]
  );

  return <DecisionContext.Provider value={value}>{children}</DecisionContext.Provider>;
}

export function useDecisions() {
  const context = useContext(DecisionContext);
  if (!context) {
    throw new Error('useDecisions must be used within DecisionProvider');
  }
  return context;
}
