import { CurrentState, DEFAULT_CURRENT_STATE, JournalThread, StateSnapshot } from '../types/core';
import { buildThreadMemoryEntry } from '../lib/journal/threadIntelligence';

export const makeStateSnapshot = (state: CurrentState): StateSnapshot => ({
  canonicalId: state.canonicalId,
  label: state.label,
  intensity: state.intensity,
  recordedAt: Date.now(),
});

export const makeDefaultThreads = (): JournalThread[] => {
  const painState: StateSnapshot = {
    canonicalId: 'in_pain',
    label: 'In Pain',
    intensity: 'high',
    recordedAt: Date.now() - 1000 * 60 * 55,
  };

  const activatedState: StateSnapshot = {
    canonicalId: 'activated',
    label: 'Activated',
    intensity: 'medium',
    recordedAt: Date.now() - 1000 * 60 * 60 * 18,
  };

  const baseThreads: JournalThread[] = [
    {
      id: 'thread-1',
      title: 'Back pain and overload notes',
      createdAt: Date.now() - 1000 * 60 * 55,
      updatedAt: Date.now() - 1000 * 60 * 30,
      startingState: painState,
      currentState: painState,
      summary: 'Pain seemed to lead the mood and the task-lock around dinner prep.',
      tags: ['pain', 'overload'],
      messages: [
        { id: 'm-1', role: 'user', text: 'My back pain is taking over and I cannot think straight.', createdAt: Date.now() - 1000 * 60 * 50 },
        { id: 'm-2', role: 'ibal', text: 'Let us keep this low-demand. Start by reducing one source of extra strain and name what the body needs first.', createdAt: Date.now() - 1000 * 60 * 49 },
      ],
      transitions: [],
    },
    {
      id: 'thread-2',
      title: 'Social recovery after a hard message',
      createdAt: Date.now() - 1000 * 60 * 60 * 18,
      updatedAt: Date.now() - 1000 * 60 * 60 * 17,
      startingState: activatedState,
      currentState: activatedState,
      summary: 'The user wanted help slowing down before replying.',
      tags: ['social', 'activated'],
      messages: [
        { id: 'm-3', role: 'user', text: 'I got a message that hit me hard and I want to fire back.', createdAt: Date.now() - 1000 * 60 * 60 * 18 },
        { id: 'm-4', role: 'ibal', text: 'Do less first. Hold the reply, cool the next action down, and decide later.', createdAt: Date.now() - 1000 * 60 * 60 * 17 },
      ],
      transitions: [],
    },
  ];

  return baseThreads.map((thread) => ({ ...thread, memory: buildThreadMemoryEntry(thread) }));
};

export const makeInitialCurrentState = (): CurrentState => ({ ...DEFAULT_CURRENT_STATE });