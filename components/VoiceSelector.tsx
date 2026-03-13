import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import type { Voice } from '../hooks/useTTS';

interface VoiceSelectorProps {
  voices: Voice[];
  selectedVoice: Voice | null;
  onSelect: (voice: Voice) => void;
}

export const VoiceSelector: React.FC<VoiceSelectorProps> = ({
  voices,
  selectedVoice,
  onSelect,
}) => {
  if (!voices.length) {
    return (
      <Text style={{ fontSize: 12, color: '#6B6866' }}>No voices available on this device.</Text>
    );
  }

  const grouped = voices.reduce<Record<string, Voice[]>>((acc, v) => {
    const lang = v.lang || 'Other';
    if (!acc[lang]) acc[lang] = [];
    acc[lang].push(v);
    return acc;
  }, {});

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 16 }}
    >
      {Object.entries(grouped).map(([lang, vs]) => (
        <View key={lang}>
          <Text
            style={{
              fontSize: 10,
              fontWeight: '600',
              color: '#6B6866',
              marginBottom: 6,
              letterSpacing: 0.5,
            }}
          >
            {lang}
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
            {vs.map((voice) => {
              const isSelected = selectedVoice?.id === voice.id;
              return (
                <Pressable
                  key={voice.id}
                  onPress={() => onSelect(voice)}
                  style={{
                    paddingHorizontal: 12,
                    paddingVertical: 7,
                    borderRadius: 16,
                    backgroundColor: isSelected ? '#F5A623' : '#242530',
                    borderWidth: isSelected ? 0 : 1,
                    borderColor: '#2A2B30',
                  }}
                >
                  <Text
                    style={{
                      fontSize: 11,
                      fontWeight: isSelected ? '600' : '400',
                      color: isSelected ? '#0F1014' : '#B0ADA5',
                    }}
                  >
                    {voice.name}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      ))}
    </ScrollView>
  );
};
