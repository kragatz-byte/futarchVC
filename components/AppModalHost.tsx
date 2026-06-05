import ConfirmationToast from '@/components/ConfirmationToast';
import ForecastModal from '@/components/ForecastModal';
import InvestmentDecisionModal from '@/components/InvestmentDecisionModal';
import { useDecisions } from '@/contexts/DecisionContext';
import { useForecasts } from '@/contexts/ForecastContext';

export default function AppModalHost() {
  const {
    modalState: decisionModal,
    toastMessage: decisionToast,
    closeDecisionModal,
    submitDecision,
    submitWatchlist,
  } = useDecisions();

  const {
    modalState: forecastModal,
    toastMessage: forecastToast,
    closeForecastModal,
    submitForecasts,
    getForecastForStartup,
  } = useForecasts();

  const toastMessage = decisionToast ?? forecastToast;

  return (
    <>
      <InvestmentDecisionModal
        visible={decisionModal.visible}
        startup={decisionModal.startup}
        mode={decisionModal.mode}
        initialDecision={decisionModal.initialDecision}
        onClose={closeDecisionModal}
        onSubmitDecision={submitDecision}
        onSubmitWatchlist={submitWatchlist}
      />

      <ForecastModal
        visible={forecastModal.visible}
        startup={forecastModal.startup}
        existingSubmission={
          forecastModal.startup
            ? getForecastForStartup(forecastModal.startup.id)
            : undefined
        }
        onClose={closeForecastModal}
        onSubmit={submitForecasts}
      />

      <ConfirmationToast message={toastMessage ?? ''} visible={Boolean(toastMessage)} />
    </>
  );
}
