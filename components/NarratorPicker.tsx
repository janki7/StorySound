import React, { useState } from 'react';
import { Modal, Pressable, ScrollView, Text, View, Platform } from 'react-native';
import { NARRATOR_PROFILES, CATEGORY_LABELS, NarratorProfile } from '../data/narratorProfiles';
import type { Voice } from '../hooks/useTTS';

interface NarratorPickerProps {
  voices: Voice[];
  selectedProfileId: string | null;
  selectedVoice: Voice | null;
  onSelectProfile: (profile: NarratorProfile, matchedVoice: Voice | null) => void;
  onSelectRawVoice: (voice: Voice) => void;
}

function findBestVoice(voices: Voice[], preferences: string[]): Voice | null {
  for (const pref of preferences) {
    const match = voices.find((v) => v.name.includes(pref));
    if (match) return match;
  }
  return voices[0] || null;
}

export const NarratorPicker: React.FC<NarratorPickerProps> = ({
  voices,
  selectedProfileId,
  selectedVoice,
  onSelectProfile,
  onSelectRawVoice,
}) => {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<'narrators' | 'voices'>('narrators');

  const currentLabel = selectedProfileId
    ? NARRATOR_PROFILES.find((p) => p.id === selectedProfileId)?.name || 'Narrator'
    : selectedVoice?.name?.split(' - ')[0]?.split(' ').slice(1).join(' ') || 'Select Voice';

  const currentIcon = selectedProfileId
    ? NARRATOR_PROFILES.find((p) => p.id === selectedProfileId)?.icon || '🎙️'
    : '🎙️';

  const categories = (['storyteller', 'professional', 'character', 'relaxing'] as const);

  return (
    <>
      {/* Trigger button */}
      <Pressable
        onPress={() => setOpen(true)}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#242530',
          borderRadius: 20,
          paddingHorizontal: 14,
          paddingVertical: 8,
          gap: 6,
          maxWidth: 180,
        }}
      >
        <Text style={{ fontSize: 16 }}>{currentIcon}</Text>
        <Text
          numberOfLines={1}
          style={{ fontSize: 12, color: '#F5A623', fontWeight: '600', flexShrink: 1 }}
        >
          {currentLabel}
        </Text>
        <Text style={{ fontSize: 10, color: '#6B6866' }}>▼</Text>
      </Pressable>

      {/* Modal picker */}
      <Modal
        visible={open}
        transparent
        animationType="slide"
        onRequestClose={() => setOpen(false)}
      >
        <Pressable
          onPress={() => setOpen(false)}
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' }}
        >
          <Pressable
            onPress={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#1A1B20',
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              maxHeight: '75%',
              paddingBottom: Platform.OS === 'web' ? 20 : 40,
            }}
          >
            {/* Handle */}
            <View style={{ alignItems: 'center', paddingTop: 12, paddingBottom: 8 }}>
              <View
                style={{
                  width: 40,
                  height: 4,
                  borderRadius: 2,
                  backgroundColor: '#3A3B40',
                }}
              />
            </View>

            {/* Title */}
            <View style={{ paddingHorizontal: 20, paddingBottom: 16 }}>
              <Text style={{ fontSize: 20, fontWeight: '700', color: '#F0EFE9' }}>
                Choose a Narrator
              </Text>
              <Text style={{ fontSize: 13, color: '#6B6866', marginTop: 4 }}>
                Pick a reading style or select a specific voice
              </Text>
            </View>

            {/* Tabs */}
            <View
              style={{
                flexDirection: 'row',
                marginHorizontal: 20,
                backgroundColor: '#0F1014',
                borderRadius: 12,
                padding: 3,
                marginBottom: 16,
              }}
            >
              {([
                { key: 'narrators' as const, label: '🎭 Narrator Styles' },
                { key: 'voices' as const, label: '🎙️ All Voices' },
              ]).map(({ key, label }) => (
                <Pressable
                  key={key}
                  onPress={() => setTab(key)}
                  style={{
                    flex: 1,
                    paddingVertical: 10,
                    borderRadius: 10,
                    alignItems: 'center',
                    backgroundColor: tab === key ? '#F5A623' : 'transparent',
                  }}
                >
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: '600',
                      color: tab === key ? '#0F1014' : '#6B6866',
                    }}
                  >
                    {label}
                  </Text>
                </Pressable>
              ))}
            </View>

            <ScrollView
              style={{ paddingHorizontal: 20 }}
              showsVerticalScrollIndicator={false}
            >
              {tab === 'narrators' ? (
                <>
                  {categories.map((cat) => {
                    const info = CATEGORY_LABELS[cat];
                    const profiles = NARRATOR_PROFILES.filter((p) => p.category === cat);
                    return (
                      <View key={cat} style={{ marginBottom: 20 }}>
                        <Text
                          style={{
                            fontSize: 11,
                            fontWeight: '600',
                            color: '#6B6866',
                            letterSpacing: 1,
                            marginBottom: 10,
                          }}
                        >
                          {info.icon} {info.label.toUpperCase()}
                        </Text>
                        {profiles.map((profile) => {
                          const isActive = selectedProfileId === profile.id;
                          const matched = findBestVoice(voices, profile.voicePreference);
                          return (
                            <Pressable
                              key={profile.id}
                              onPress={() => {
                                onSelectProfile(profile, matched);
                                setOpen(false);
                              }}
                              style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                backgroundColor: isActive ? 'rgba(245,166,35,0.12)' : '#242530',
                                borderRadius: 14,
                                padding: 14,
                                marginBottom: 8,
                                borderWidth: isActive ? 1.5 : 0,
                                borderColor: isActive ? '#F5A623' : 'transparent',
                              }}
                            >
                              <View
                                style={{
                                  width: 44,
                                  height: 44,
                                  borderRadius: 22,
                                  backgroundColor: isActive
                                    ? 'rgba(245,166,35,0.2)'
                                    : '#1A1B20',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  marginRight: 14,
                                }}
                              >
                                <Text style={{ fontSize: 20 }}>{profile.icon}</Text>
                              </View>
                              <View style={{ flex: 1 }}>
                                <Text
                                  style={{
                                    fontSize: 15,
                                    fontWeight: '600',
                                    color: isActive ? '#F5A623' : '#F0EFE9',
                                  }}
                                >
                                  {profile.name}
                                </Text>
                                <Text
                                  style={{
                                    fontSize: 12,
                                    color: '#6B6866',
                                    marginTop: 2,
                                  }}
                                >
                                  {profile.description}
                                </Text>
                                <View style={{ flexDirection: 'row', gap: 8, marginTop: 6 }}>
                                  <Text style={{ fontSize: 10, color: '#4A4843' }}>
                                    Speed: {profile.speed}x
                                  </Text>
                                  <Text style={{ fontSize: 10, color: '#4A4843' }}>
                                    Pitch: {profile.pitch.toFixed(2)}
                                  </Text>
                                  {matched && (
                                    <Text style={{ fontSize: 10, color: '#4A4843' }}>
                                      Voice: {matched.name.split(' - ')[0].split(' ').slice(1).join(' ')}
                                    </Text>
                                  )}
                                </View>
                              </View>
                              {isActive && (
                                <Text style={{ fontSize: 16, color: '#F5A623', marginLeft: 8 }}>
                                  ✓
                                </Text>
                              )}
                            </Pressable>
                          );
                        })}
                      </View>
                    );
                  })}
                </>
              ) : (
                <>
                  <Text
                    style={{
                      fontSize: 11,
                      fontWeight: '600',
                      color: '#6B6866',
                      letterSpacing: 1,
                      marginBottom: 10,
                    }}
                  >
                    SYSTEM VOICES ({voices.length})
                  </Text>
                  {voices.map((voice) => {
                    const isSelected = selectedVoice?.id === voice.id && !selectedProfileId;
                    return (
                      <Pressable
                        key={voice.id}
                        onPress={() => {
                          onSelectRawVoice(voice);
                          setOpen(false);
                        }}
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          backgroundColor: isSelected ? 'rgba(245,166,35,0.12)' : '#242530',
                          borderRadius: 12,
                          padding: 12,
                          marginBottom: 6,
                          borderWidth: isSelected ? 1.5 : 0,
                          borderColor: isSelected ? '#F5A623' : 'transparent',
                        }}
                      >
                        <View
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: 18,
                            backgroundColor: '#1A1B20',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginRight: 12,
                          }}
                        >
                          <Text style={{ fontSize: 14 }}>🎙️</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text
                            numberOfLines={1}
                            style={{
                              fontSize: 13,
                              fontWeight: isSelected ? '600' : '400',
                              color: isSelected ? '#F5A623' : '#F0EFE9',
                            }}
                          >
                            {voice.name}
                          </Text>
                          <Text style={{ fontSize: 10, color: '#4A4843', marginTop: 1 }}>
                            {voice.lang}
                          </Text>
                        </View>
                        {isSelected && (
                          <Text style={{ fontSize: 16, color: '#F5A623' }}>✓</Text>
                        )}
                      </Pressable>
                    );
                  })}
                </>
              )}
              <View style={{ height: 20 }} />
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
};
