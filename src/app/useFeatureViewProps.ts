import { AppShellController } from './useAppShellController';

export interface FeatureViewProps {
  journalProps: {
    threads: AppShellController['journalThreads'];
    currentState: AppShellController['currentState'];
    onCreateThread: AppShellController['handleCreateThread'];
    onOpenThread: AppShellController['handleOpenThread'];
    onSendMessage: AppShellController['handleSendMessage'];
    onKeepThreadState: AppShellController['handleKeepThreadState'];
    onApplySuggestedTags: AppShellController['handleApplySuggestedTags'];
    onRequestStateUpdate: () => void;
  };
  learnMeProps: {
    signals: AppShellController['learningSignals'];
    sensorySupports: AppShellController['sensorySupports'];
    memoryEntries: AppShellController['memoryEntries'];
    memorySummary: AppShellController['memorySummary'];
    supportEvidence: AppShellController['supportEvidence'];
    supportEvidenceSummary: AppShellController['supportEvidenceSummary'];
    evidenceItems: AppShellController['evidenceItems'];
    evidenceSummary: AppShellController['evidenceSummary'];
    summary: AppShellController['patternSummary'];
    thresholdSummary: AppShellController['thresholdSummary'];
    onConfirmSignal: AppShellController['handleConfirmSignal'];
    onConfirmSensory: AppShellController['handleConfirmSensory'];
    onToggleEvidenceContested: AppShellController['handleToggleEvidenceContested'];
    onResolveEvidence: AppShellController['handleResolveEvidence'];
    onSaveMemoryEntry: AppShellController['handleSaveMemoryEntry'];
  };
  customizeProps: {
    customStates: AppShellController['customStates'];
    sensorySupports: AppShellController['sensorySupports'];
    onRenameState: AppShellController['handleRenameState'];
    onToggleStateFavorite: AppShellController['handleToggleStateFavorite'];
    onToggleStateHidden: AppShellController['handleToggleStateHidden'];
    onToggleComfortFavorite: AppShellController['handleToggleComfortFavorite'];
    onToggleComfortHidden: AppShellController['handleToggleComfortHidden'];
  };
  helpNowProps: {
    currentState: AppShellController['currentState'];
    thresholdSummary: AppShellController['thresholdSummary'];
    personalizedSupports: AppShellController['personalizedSupports'];
    recommendationLedger: AppShellController['recommendationLedger'];
    activeTrial: AppShellController['activeTrial'];
    onApplyRouteState: AppShellController['handleApplyRouteState'];
    onStartTrial: AppShellController['handleStartTrial'];
    onClearTrial: AppShellController['handleClearTrial'];
    onLogOutcome: AppShellController['handleLogOutcome'];
    onSaveTrialReflection: AppShellController['handleSaveTrialReflection'];
    onReviewTransfer: AppShellController['handleReviewTransfer'];
    onRevalidateSupport: AppShellController['handleRevalidateSupport'];
    recentOutcomeSummary: AppShellController['recentOutcomeSummary'];
  };
}

export const useFeatureViewProps = (
  controller: AppShellController,
  setSelectorOpen: (open: boolean) => void
): FeatureViewProps => {
  return {
    journalProps: {
      threads: controller.journalThreads,
      currentState: controller.currentState,
      onCreateThread: controller.handleCreateThread,
      onOpenThread: controller.handleOpenThread,
      onSendMessage: controller.handleSendMessage,
      onKeepThreadState: controller.handleKeepThreadState,
      onApplySuggestedTags: controller.handleApplySuggestedTags,
      onRequestStateUpdate: () => setSelectorOpen(true),
    },
    learnMeProps: {
      signals: controller.learningSignals,
      sensorySupports: controller.sensorySupports,
      memoryEntries: controller.memoryEntries,
      memorySummary: controller.memorySummary,
      supportEvidence: controller.supportEvidence,
      supportEvidenceSummary: controller.supportEvidenceSummary,
      evidenceItems: controller.evidenceItems,
      evidenceSummary: controller.evidenceSummary,
      summary: controller.patternSummary,
      thresholdSummary: controller.thresholdSummary,
      onConfirmSignal: controller.handleConfirmSignal,
      onConfirmSensory: controller.handleConfirmSensory,
      onToggleEvidenceContested: controller.handleToggleEvidenceContested,
      onResolveEvidence: controller.handleResolveEvidence,
      onSaveMemoryEntry: controller.handleSaveMemoryEntry,
    },
    customizeProps: {
      customStates: controller.customStates,
      sensorySupports: controller.sensorySupports,
      onRenameState: controller.handleRenameState,
      onToggleStateFavorite: controller.handleToggleStateFavorite,
      onToggleStateHidden: controller.handleToggleStateHidden,
      onToggleComfortFavorite: controller.handleToggleComfortFavorite,
      onToggleComfortHidden: controller.handleToggleComfortHidden,
    },
    helpNowProps: {
      currentState: controller.currentState,
      thresholdSummary: controller.thresholdSummary,
      personalizedSupports: controller.personalizedSupports,
      recommendationLedger: controller.recommendationLedger,
      activeTrial: controller.activeTrial,
      onApplyRouteState: controller.handleApplyRouteState,
      onStartTrial: controller.handleStartTrial,
      onClearTrial: controller.handleClearTrial,
      onLogOutcome: controller.handleLogOutcome,
      onSaveTrialReflection: controller.handleSaveTrialReflection,
      onReviewTransfer: controller.handleReviewTransfer,
      onRevalidateSupport: controller.handleRevalidateSupport,
      recentOutcomeSummary: controller.recentOutcomeSummary,
    },
  };
};

export default useFeatureViewProps;