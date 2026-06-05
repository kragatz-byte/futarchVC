/** Per-startup probability forecasts — separate from invest/pass (futarchy “market” layer). */
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { loadStoredDecisions } from '@/lib/decisionStorage';
import {
  createForecastSubmissionId,
  loadStoredForecasts,
  persistForecasts,
  upsertForecastSubmission,
} from '@/lib/forecastStorage';
import { useAuth } from '@/contexts/AuthContext';
import { isSupabaseConfigured } from '@/lib/supabase';
import { saveForecastsToSupabase } from '@/services/supabase/forecasts';
import {
  computeLocalStartupAggregates,
  type StartupAggregateStats,
} from '@/services/startupAggregates';
import { patchStartupInRegistry } from '@/services/startupRegistry';
import type { ForecastAnswer, Startup, StartupForecastSubmission } from '@/types';

type ForecastModalState = {
  visible: boolean;
  startup: Startup | null;
};

type ForecastContextValue = {
  forecasts: StartupForecastSubmission[];
  modalState: ForecastModalState;
  toastMessage: string | null;
  openForecastModal: (startup: Startup) => void;
  closeForecastModal: () => void;
  submitForecasts: (answers: ForecastAnswer[]) => Promise<void>;
  dismissToast: () => void;
  getForecastForStartup: (startupId: string) => StartupForecastSubmission | undefined;
};

const initialModalState: ForecastModalState = {
  visible: false,
  startup: null,
};

const DEMO_CONFIRMATION =
  'Forecast saved locally. Your reputation will update as outcomes resolve.';

const SUPABASE_CONFIRMATION =
  'Forecast saved. Community stats updated on FutarchyVC.';

const SYNC_FAILED_CONFIRMATION =
  'Forecast saved on this device. Cloud sync failed — try again later.';

const ForecastContext = createContext<ForecastContextValue | null>(null);

export function ForecastProvider({ children }: { children: ReactNode }) {
  const { userId, isDemoMode } = useAuth();
  const [forecasts, setForecasts] = useState<StartupForecastSubmission[]>([]);
  const [modalState, setModalState] = useState<ForecastModalState>(initialModalState);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    loadStoredForecasts().then(setForecasts);
  }, []);

  useEffect(() => {
    if (!toastMessage) return;

    const timer = setTimeout(() => {
      setToastMessage(null);
    }, 4000);

    return () => clearTimeout(timer);
  }, [toastMessage]);

  const applyLocalAggregateStats = useCallback(
    async (startupId: string, nextForecasts: StartupForecastSubmission[]) => {
      const { decisions } = await loadStoredDecisions();
      const stats: StartupAggregateStats = computeLocalStartupAggregates(
        startupId,
        decisions,
        nextForecasts
      );
      patchStartupInRegistry(startupId, stats);
    },
    []
  );

  const openForecastModal = useCallback((startup: Startup) => {
    setModalState({ visible: true, startup });
  }, []);

  const closeForecastModal = useCallback(() => {
    setModalState(initialModalState);
  }, []);

  const submitForecasts = useCallback(
    async (answers: ForecastAnswer[]) => {
      if (!modalState.startup || answers.length === 0) return;

      const existing = forecasts.find(
        (item) => item.startupId === modalState.startup!.id && item.userId === userId
      );

      const submission: StartupForecastSubmission = {
        id: existing?.id ?? createForecastSubmissionId(),
        startupId: modalState.startup.id,
        userId,
        answers,
        createdAt: existing?.createdAt ?? new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const nextForecasts = upsertForecastSubmission(forecasts, submission);
      setForecasts(nextForecasts);
      await persistForecasts(nextForecasts);

      const startupId = modalState.startup.id;

      if (isDemoMode || !isSupabaseConfigured()) {
        await applyLocalAggregateStats(startupId, nextForecasts);
        closeForecastModal();
        setToastMessage(DEMO_CONFIRMATION);
        return;
      }

      const remote = await saveForecastsToSupabase(submission);
      await applyLocalAggregateStats(startupId, nextForecasts);
      closeForecastModal();
      setToastMessage(remote.ok ? SUPABASE_CONFIRMATION : SYNC_FAILED_CONFIRMATION);
    },
    [
      applyLocalAggregateStats,
      closeForecastModal,
      forecasts,
      isDemoMode,
      modalState.startup,
      userId,
    ]
  );

  const dismissToast = useCallback(() => {
    setToastMessage(null);
  }, []);

  const getForecastForStartup = useCallback(
    (startupId: string) =>
      forecasts.find((item) => item.startupId === startupId && item.userId === userId),
    [forecasts, userId]
  );

  const value = useMemo<ForecastContextValue>(
    () => ({
      forecasts,
      modalState,
      toastMessage,
      openForecastModal,
      closeForecastModal,
      submitForecasts,
      dismissToast,
      getForecastForStartup,
    }),
    [
      closeForecastModal,
      dismissToast,
      forecasts,
      getForecastForStartup,
      modalState,
      openForecastModal,
      submitForecasts,
      toastMessage,
    ]
  );

  return <ForecastContext.Provider value={value}>{children}</ForecastContext.Provider>;
}

export function useForecasts() {
  const context = useContext(ForecastContext);
  if (!context) {
    throw new Error('useForecasts must be used within ForecastProvider');
  }
  return context;
}
