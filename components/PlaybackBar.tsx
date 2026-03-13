import React, { useCallback, useState } from 'react';
import { Platform, Pressable, Text, View } from 'react-native';
import { useSettings } from '../contexts/SettingsContext';
import { NarratorPicker } from './NarratorPicker';
import { SpeedControl } from './SpeedControl';
import type { Voice } from '../hooks/useTTS';
import type { NarratorProfile } from '../data/narratorProfiles';

interface PlaybackBarProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onStop: () => void;
  onNext: () => void;
  onPrev: () => void;
  voices: Voice[];
  selectedVoice: Voice | null;
  onSelectVoice: (voice: Voice) => void;
  speed: number;
  setSpeed: (speed: number) => void;
  pitch: number;
  setPitch: (p: number) => void;
}

export const PlaybackBar: React.FC<PlaybackBarProps> = ({
  isPlaying,
  onPlayPause,
  onStop,
  onNext,
  onPrev,
  voices,
  selectedVoice,
  onSelectVoice,
  speed,
  setSpeed,
  pitch,
  setPitch,
}) => {
  const { colors } = useSettings();
  const [expanded, setExpanded] = useState(false);
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);

  const handleSelectProfile = useCallback(
    (profile: NarratorProfile, matchedVoice: Voice | null) => {
      setSelectedProfileId(profile.id);
      setSpeed(profile.speed);
      setPitch(profile.pitch);
      if (matchedVoice) {
        onSelectVoice(matchedVoice);
      }
    },
    [onSelectVoice, setSpeed, setPitch]
  );

  const handleSelectRawVoice = useCallback(
    (voice: Voice) => {
      setSelectedProfileId(null);
      onSelectVoice(voice);
      setSpeed(1.0);
      setPitch(1.0);
    },
    [onSelectVoice, setSpeed, setPitch]
  );

  return (
    <View
      style={{
        backgroundColor: colors.surface,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        paddingBottom: Platform.OS === 'web' ? 0 : 8,
      }}
    >
      {/* Main controls row */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 12,
          paddingVertical: 10,
          gap: 4,
        }}
      >
        {/* Narrator picker */}
        <NarratorPicker
          voices={voices}
          selectedProfileId={selectedProfileId}
          selectedVoice={selectedVoice}
          onSelectProfile={handleSelectProfile}
          onSelectRawVoice={handleSelectRawVoice}
        />

        {/* Transport controls */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 8 }}>
          <Pressable
            onPress={onPrev}
            style={{
              width: 42,
              height: 42,
              borderRadius: 21,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ fontSize: 16, color: colors.textSecondary }}>{'⏮'}</Text>
          </Pressable>

          <Pressable
            onPress={onPlayPause}
            style={{
              width: 52,
              height: 52,
              borderRadius: 26,
              backgroundColor: colors.accent,
              alignItems: 'center',
              justifyContent: 'center',
              marginHorizontal: 6,
              elevation: 8,
            }}
          >
            <Text style={{ fontSize: 20, color: colors.accentOnAccent }}>
              {isPlaying ? '⏸' : '▶️'}
            </Text>
          </Pressable>

          <Pressable
            onPress={onNext}
            style={{
              width: 42,
              height: 42,
              borderRadius: 21,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ fontSize: 16, color: colors.textSecondary }}>{'⏭'}</Text>
          </Pressable>
        </View>

        {/* Speed pill */}
        <Pressable
          onPress={() => setExpanded(!expanded)}
          style={{
            backgroundColor: colors.surfaceAlt,
            borderRadius: 16,
            paddingHorizontal: 12,
            paddingVertical: 7,
            marginLeft: 8,
          }}
        >
          <Text style={{ fontSize: 12, color: colors.accent, fontWeight: '600' }}>
            {speed.toFixed(1)}x
          </Text>
        </Pressable>
      </View>

      {/* Expandable speed panel */}
      {expanded && (
        <View
          style={{
            borderTopWidth: 1,
            borderTopColor: colors.border,
            paddingVertical: 12,
            paddingHorizontal: 16,
          }}
        >
          <Text
            style={{
              fontSize: 11,
              fontWeight: '600',
              color: colors.textSecondary,
              marginBottom: 8,
              letterSpacing: 1,
            }}
          >
            SPEED
          </Text>
          <SpeedControl speed={speed} setSpeed={setSpeed} />
        </View>
      )}
    </View>
  );
};
