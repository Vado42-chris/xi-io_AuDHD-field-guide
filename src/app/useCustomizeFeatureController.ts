import { Dispatch, SetStateAction } from 'react';
import { CurrentState, CustomStateLabel, SensorySupportRecord } from '../types/core';

interface CustomizeFeatureControllerArgs {
  currentState: CurrentState;
  setCurrentState: Dispatch<SetStateAction<CurrentState>>;
  setCustomStates: Dispatch<SetStateAction<CustomStateLabel[]>>;
  setSensorySupports: Dispatch<SetStateAction<SensorySupportRecord[]>>;
}

export interface CustomizeFeatureController {
  handleRenameState: (stateId: string, label: string) => void;
  handleToggleStateFavorite: (stateId: string) => void;
  handleToggleStateHidden: (stateId: string) => void;
  handleToggleComfortFavorite: (recordId: string) => void;
  handleToggleComfortHidden: (recordId: string) => void;
}

export const useCustomizeFeatureController = ({
  currentState,
  setCurrentState,
  setCustomStates,
  setSensorySupports,
}: CustomizeFeatureControllerArgs): CustomizeFeatureController => {
  const handleRenameState = (stateId: string, label: string) => {
    const cleaned = label.trimStart();
    setCustomStates((prev) => {
      const target = prev.find((state) => state.id === stateId);
      const nextStates = prev.map((state) => (state.id === stateId ? { ...state, label: cleaned } : state));
      if (target && currentState.canonicalId === target.canonicalId && currentState.label === target.label) {
        setCurrentState((current) => ({ ...current, label: cleaned, updatedAt: Date.now() }));
      }
      return nextStates;
    });
  };

  const handleToggleStateFavorite = (stateId: string) => {
    setCustomStates((prev) => prev.map((state) => (state.id === stateId ? { ...state, favorite: !state.favorite } : state)));
  };

  const handleToggleStateHidden = (stateId: string) => {
    setCustomStates((prev) => prev.map((state) => (state.id === stateId ? { ...state, hidden: !state.hidden } : state)));
  };

  const handleToggleComfortFavorite = (recordId: string) => {
    setSensorySupports((prev) => prev.map((record) => (record.id === recordId ? { ...record, favorite: !record.favorite } : record)));
  };

  const handleToggleComfortHidden = (recordId: string) => {
    setSensorySupports((prev) => prev.map((record) => (record.id === recordId ? { ...record, hidden: !record.hidden } : record)));
  };

  return {
    handleRenameState,
    handleToggleStateFavorite,
    handleToggleStateHidden,
    handleToggleComfortFavorite,
    handleToggleComfortHidden,
  };
};