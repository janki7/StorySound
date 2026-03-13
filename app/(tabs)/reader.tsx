import React, { useMemo, useState } from 'react';
import { View, Text, Pressable, ScrollView, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useLibrary } from '../../hooks/useLibrary';
import { useBookContext } from '../../contexts/BookContext';
import { useTTS } from '../../hooks/useTTS';
import { WordHighlighter } from '../../components/WordHighlighter';
import { PlaybackBar } from '../../components/PlaybackBar';

type FontSize = 's' | 'm' | 'l';

export default function ReaderScreen() {
  const router = useRouter();
  const { bookId } = useLocalSearchParams<{ bookId?: string }>();
  const { books, updateProgress } = useLibrary();
  const { currentBook } = useBookContext();
  const tts = useTTS();

  const [fontSize, setFontSize] = useState<FontSize>('m');

  const activeBook = useMemo(
    () => books.find((b) => b.id === bookId) || null,
    [books, bookId]
  );

  const sentences = currentBook?.sentences || [];

  const onJumpTo = (sentenceIndex: number, wordIndex: number) => {
    if (!sentences.length) return;
    tts.play(sentences, sentenceIndex, wordIndex);
  };

  const toggleFontSize = () => {
    setFontSize((prev) => (prev === 's' ? 'm' : prev === 'm' ? 'l' : 's'));
  };

  const onBack = () => {
    router.back();
  };

  const title = currentBook?.title || activeBook?.title || 'Reader';
  const fontLabel = fontSize === 's' ? 'A' : fontSize === 'm' ? 'A' : 'A';

  return (
    <View style={{ flex: 1, backgroundColor: '#0F1014' }}>
      {/* Top bar */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 16,
          paddingTop: Platform.OS === 'web' ? 16 : 50,
          paddingBottom: 12,
          backgroundColor: '#1A1B20',
          borderBottomWidth: 1,
          borderBottomColor: '#2A2B30',
        }}
      >
        <Pressable
          onPress={onBack}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: '#242530',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ fontSize: 18, color: '#F0EFE9' }}>{'←'}</Text>
        </Pressable>
        <View style={{ flex: 1, paddingHorizontal: 12 }}>
          <Text
            numberOfLines={1}
            style={{
              fontSize: 15,
              fontWeight: '600',
              textAlign: 'center',
              color: '#F0EFE9',
            }}
          >
            {title}
          </Text>
          {currentBook?.author && (
            <Text
              numberOfLines={1}
              style={{
                fontSize: 11,
                textAlign: 'center',
                color: '#6B6866',
                marginTop: 1,
              }}
            >
              {currentBook.author}
            </Text>
          )}
        </View>
        <Pressable
          onPress={toggleFontSize}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: '#242530',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text
            style={{
              fontSize: fontSize === 's' ? 12 : fontSize === 'm' ? 15 : 18,
              fontWeight: '700',
              color: '#F5A623',
            }}
          >
            A
          </Text>
        </Pressable>
      </View>

      {/* Reader content */}
      {sentences.length === 0 ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 }}>
          <Text style={{ fontSize: 48, marginBottom: 16 }}>🎧</Text>
          <Text
            style={{
              fontSize: 18,
              fontWeight: '600',
              color: '#F0EFE9',
              textAlign: 'center',
              marginBottom: 8,
            }}
          >
            Ready to listen
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: '#6B6866',
              textAlign: 'center',
              lineHeight: 21,
            }}
          >
            Open a book from your library{'\n'}to start your listening session
          </Text>
        </View>
      ) : (
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
        >
          <WordHighlighter
            sentences={sentences}
            currentSentenceIndex={tts.currentSentenceIndex}
            currentWordIndex={tts.currentWordIndex}
            fontSize={fontSize}
            onJumpTo={onJumpTo}
          />
        </ScrollView>
      )}

      {/* Playback bar */}
      <PlaybackBar
        isPlaying={tts.isPlaying}
        onPlayPause={() =>
          tts.isPlaying ? tts.pause() : tts.play(sentences, tts.currentSentenceIndex)
        }
        onStop={tts.stop}
        onNext={tts.skipForward}
        onPrev={tts.skipBack}
        voices={tts.voices}
        selectedVoice={tts.selectedVoice}
        onSelectVoice={tts.setVoice}
        speed={tts.speed}
        setSpeed={tts.setSpeed}
        pitch={tts.pitch}
        setPitch={tts.setPitch}
      />
    </View>
  );
}
