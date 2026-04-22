import { Dispatch, SetStateAction } from 'react';
import { CurrentState, JournalThread, MemoryEntryStatus } from '../types/core';
import { buildThreadMemoryEntry } from '../lib/journal/threadIntelligence';
import { makeStateSnapshot } from './appShellDefaults';

interface JournalFeatureControllerArgs {
  currentState: CurrentState;
  setJournalThreads: Dispatch<SetStateAction<JournalThread[]>>;
  setActiveSection: (section: 'journal') => void;
}

export interface JournalFeatureController {
  handleCreateThread: () => void;
  handleOpenThread: (threadId: string) => void;
  handleSendMessage: (threadId: string, text: string) => void;
  handleKeepThreadState: (threadId: string) => void;
  handleApplySuggestedTags: (threadId: string) => void;
  handleConfirmMemoryEntry: (entryId: string) => void;
  handleSaveMemoryEntry: (entryId: string, summary: string, confirmedTags: string[], status: MemoryEntryStatus, notes: string) => void;
}

export const useJournalFeatureController = ({
  currentState,
  setJournalThreads,
  setActiveSection,
}: JournalFeatureControllerArgs): JournalFeatureController => {
  const handleCreateThread = () => {
    const snapshot = makeStateSnapshot(currentState);
    const baseThread: JournalThread = {
      id: `thread-${Date.now()}`,
      title: `${currentState.label} check-in`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      startingState: snapshot,
      currentState: snapshot,
      summary: `Started from ${currentState.label.toLowerCase()} · ${currentState.intensity}.`,
      tags: [currentState.canonicalId],
      messages: [{ id: `m-${Date.now()}`, role: 'ibal', text: `Starting from ${currentState.label.toLowerCase()} · ${currentState.intensity}. You can keep this brief. What feels most important to capture right now?`, createdAt: Date.now() }],
      transitions: [],
    };
    const newThread = { ...baseThread, memory: buildThreadMemoryEntry(baseThread) };
    setJournalThreads((prev) => [newThread, ...prev]);
    setActiveSection('journal');
  };

  const handleOpenThread = (threadId: string) => {
    setJournalThreads((prev) => {
      const found = prev.find((thread) => thread.id === threadId);
      if (!found) return prev;
      return [found, ...prev.filter((thread) => thread.id !== threadId)];
    });
  };

  const handleSendMessage = (threadId: string, text: string) => {
    setJournalThreads((prev) => prev.map((thread) => {
      if (thread.id !== threadId) return thread;
      const userMessage = { id: `m-${Date.now()}-u`, role: 'user' as const, text, createdAt: Date.now() };
      const ibalMessage = { id: `m-${Date.now()}-i`, role: 'ibal' as const, text: 'Noted. I will treat this as part of the same thread and keep the context connected. After this send, check whether your state still fits.', createdAt: Date.now() + 1 };
      const nextThread: JournalThread = { ...thread, updatedAt: Date.now(), summary: text.length > 120 ? `${text.slice(0, 117)}...` : text, messages: [...thread.messages, userMessage, ibalMessage] };
      const rebuilt = buildThreadMemoryEntry(nextThread);
      return { ...nextThread, memory: { ...rebuilt, status: thread.memory?.status ?? rebuilt.status, notes: thread.memory?.notes ?? rebuilt.notes } };
    }));
  };

  const handleKeepThreadState = (threadId: string) => {
    setJournalThreads((prev) => prev.map((thread) => {
      if (thread.id !== threadId) return thread;
      const nextState = makeStateSnapshot(currentState);
      const transition = { id: `transition-${Date.now()}`, from: thread.currentState, to: nextState, createdAt: Date.now(), source: 'post_send' as const };
      return { ...thread, updatedAt: Date.now(), currentState: nextState, transitions: [...thread.transitions, transition] };
    }));
  };

  const handleApplySuggestedTags = (threadId: string) => {
    setJournalThreads((prev) => prev.map((thread) => {
      if (thread.id !== threadId || !thread.memory) return thread;
      const mergedTags = Array.from(new Set([...thread.tags, ...thread.memory.suggestedTags]));
      return { ...thread, tags: mergedTags, memory: { ...thread.memory, confirmedTags: mergedTags, status: 'confirmed' } };
    }));
  };

  const handleConfirmMemoryEntry = (entryId: string) => {
    const threadId = entryId.replace('memory-', '');
    setJournalThreads((prev) => prev.map((thread) => {
      if (thread.id !== threadId || !thread.memory) return thread;
      const mergedTags = Array.from(new Set([...thread.tags, ...thread.memory.confirmedTags]));
      return { ...thread, tags: mergedTags, memory: { ...thread.memory, confirmedTags: mergedTags, status: 'confirmed' } };
    }));
  };

  const handleSaveMemoryEntry = (entryId: string, summary: string, confirmedTags: string[], status: MemoryEntryStatus, notes: string) => {
    const threadId = entryId.replace('memory-', '');
    setJournalThreads((prev) => prev.map((thread) => {
      if (thread.id !== threadId) return thread;
      const baseMemory = thread.memory ?? buildThreadMemoryEntry(thread);
      const mergedTags = Array.from(new Set(confirmedTags));
      return {
        ...thread,
        updatedAt: Date.now(),
        tags: mergedTags.length > 0 ? mergedTags : thread.tags,
        memory: {
          ...baseMemory,
          summary: summary || baseMemory.summary,
          confirmedTags: mergedTags,
          status,
          notes,
          lastStructuredAt: Date.now(),
        },
      };
    }));
  };

  return {
    handleCreateThread,
    handleOpenThread,
    handleSendMessage,
    handleKeepThreadState,
    handleApplySuggestedTags,
    handleConfirmMemoryEntry,
    handleSaveMemoryEntry,
  };
};