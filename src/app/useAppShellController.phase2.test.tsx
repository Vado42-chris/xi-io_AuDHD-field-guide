import { act, renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useAppShellController } from './useAppShellController';

describe('useAppShellController phase 2 reliability coverage', () => {
  it('adds journal memory into the shared evidence intake after a journal flow creates structured memory', async () => {
    const { result } = renderHook(() => useAppShellController());

    await waitFor(() => {
      expect(result.current.journalThreads.length).toBeGreaterThan(0);
    });

    const threadId = result.current.journalThreads[0].id;

    act(() => {
      result.current.handleSendMessage(threadId, 'Sound and clutter push me into overload fast. A darker room and lower noise help me settle.');
    });

    act(() => {
      result.current.handleApplySuggestedTags(threadId);
    });

    await waitFor(() => {
      expect(result.current.memoryEntries.length).toBeGreaterThan(0);
    });

    await waitFor(() => {
      expect(result.current.journalEvidence.length).toBeGreaterThan(0);
      expect(result.current.evidenceIntakeSummary.journal).toBeGreaterThan(0);
      expect(result.current.evidenceContributions.some((item) => item.source === 'journal')).toBe(true);
    });
  });

  it('stays in a low-data readiness state until enough evidence has been collected', async () => {
    const { result } = renderHook(() => useAppShellController());

    await waitFor(() => {
      expect(result.current.thresholdSummary.readiness).not.toBe('ready');
    });

    expect(result.current.thresholdSummary.canPersonalize).toBe(false);
    expect(result.current.recommendationLedger.length).toBeGreaterThanOrEqual(0);
    expect(result.current.supportEvidenceSummary.total).toBe(0);

    act(() => {
      result.current.handleApplyRouteState('unclear');
    });

    await waitFor(() => {
      expect(result.current.currentState.canonicalId).toBe('unclear');
      expect(result.current.thresholdSummary.readiness).not.toBe('ready');
    });
  });
});
