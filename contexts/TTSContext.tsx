import React, { createContext, useContext, useEffect } from 'react';
import { useTTS } from '../hooks/useTTS';
import { useSettings } from './SettingsContext';

const TTSContext = createContext<ReturnType<typeof useTTS> | null>(null);

export function TTSProvider({ children }: { children: React.ReactNode }) {
  const tts = useTTS();
  const settings = useSettings();

  // Sync default speed from settings to TTS when settings load or change
  useEffect(() => {
    if (settings.loaded) {
      tts.setSpeed(settings.speed);
    }
  }, [settings.loaded, settings.speed, tts]);

  return <TTSContext.Provider value={tts}>{children}</TTSContext.Provider>;
}

export function useTTSContext() {
  const ctx = useContext(TTSContext);
  if (!ctx) throw new Error('useTTSContext must be used within a TTSProvider');
  return ctx;
}
