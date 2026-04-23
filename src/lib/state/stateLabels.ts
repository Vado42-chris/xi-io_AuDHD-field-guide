import { CanonicalStateId, CustomStateLabel } from '../../types/core';

const fallbackLabel = (canonicalId: CanonicalStateId): string => {
  switch (canonicalId) {
    case 'in_pain':
      return 'In Pain';
    case 'shut_down':
      return 'Shut Down';
    case 'overloaded':
      return 'Overloaded';
    case 'activated':
      return 'Activated';
    case 'stuck':
      return 'Stuck';
    case 'steady':
      return 'Steady';
    case 'unclear':
    default:
      return 'Unclear';
  }
};

export const getDisplayStateLabel = (
  canonicalId: CanonicalStateId,
  customStates: CustomStateLabel[],
  preferredLabel?: string
): string => {
  if (preferredLabel?.trim()) return preferredLabel.trim();
  const match = customStates.find((state) => state.canonicalId === canonicalId && !state.hidden)
    ?? customStates.find((state) => state.canonicalId === canonicalId);
  if (match?.label?.trim()) return match.label.trim();
  return fallbackLabel(canonicalId);
};

export default getDisplayStateLabel;