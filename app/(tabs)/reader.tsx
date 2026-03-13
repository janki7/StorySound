import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, Pressable, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useLibrary } from '../../hooks/useLibrary';
import { useBookContext } from '../../contexts/BookContext';
import { useSettings } from '../../contexts/SettingsContext';
import { useTTSContext } from '../../contexts/TTSContext';
import { WordHighlighter } from '../../components/WordHighlighter';
import { PlaybackBar } from '../../components/PlaybackBar';
import type { FontSize } from '../../contexts/SettingsContext';

export default function ReaderScreen() {
  const router = useRouter();
  const { bookId } = useLocalSearchParams<{ bookId?: string }>();
  const { books } = useLibrary();
  const { currentBook } = useBookContext();
  const settings = useSettings();
  const { colors } = settings;
  const tts = useTTSContext();

  const fontSize = settings.fontSize;
  const [newBookLoaded, setNewBookLoaded] = useState(false);
  const lastBookIdRef = useRef<string | null>(null);

  // Stop TTS when switching to a different book
  useEffect(() => {
    const id = currentBook?.id ?? null;
    if (id !== lastBookIdRef.current) {
      lastBookIdRef.current = id;
      tts.stop();
      if (id) setNewBookLoaded(true);
    }
  }, [currentBook?.id, tts.stop]);

  const activeBook = useMemo(
    () => books.find((b) => b.id === bookId) || null,
    [books, bookId]
  );

  const sentences = currentBook?.sentences || [];

  const onJumpTo = useCallback(
    (sentenceIndex: number, wordIndex: number) => {
      if (!sentences.length) return;
      setNewBookLoaded(false);
      tts.play(sentences, sentenceIndex, wordIndex);
    },
    [sentences, tts]
  );

  const onPlayPause = useCallback(() => {
    if (tts.isPlaying) {
      tts.pause();
    } else {
      setNewBookLoaded(false);
      tts.play(sentences, tts.currentSentenceIndex);
    }
  }, [tts.isPlaying, tts.currentSentenceIndex, sentences, tts]);

  const toggleFontSize = () => {
    const next: FontSize = fontSize === 's' ? 'm' : fontSize === 'm' ? 'l' : 's';
    settings.setFontSize(next);
  };

  const onBack = () => {
    router.back();
  };

  const title = currentBook?.title || activeBook?.title || 'Reader';
  const fontLabel = fontSize === 's' ? 'A' : fontSize === 'm' ? 'A' : 'A';

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Top bar */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 16,
          paddingTop: Platform.OS === 'web' ? 16 : 50,
          paddingBottom: 12,
          backgroundColor: colors.surface,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        }}
      >
        <Pressable
          onPress={onBack}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: colors.surfaceAlt,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ fontSize: 18, color: colors.textPrimary }}>{'←'}</Text>
        </Pressable>
        <View style={{ flex: 1, paddingHorizontal: 12 }}>
          {tts.isPlaying && (
            <View
              style={{
                alignSelf: 'center',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 6,
                marginBottom: 4,
              }}
            >
              <View
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: colors.accent,
                }}
              />
              <Text style={{ fontSize: 10, fontWeight: '600', color: colors.accent, letterSpacing: 0.5 }}>
                NOW PLAYING
              </Text>
            </View>
          )}
          <Text
            numberOfLines={1}
            style={{
              fontSize: 15,
              fontWeight: '600',
              textAlign: 'center',
              color: colors.textPrimary,
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
                color: colors.textSecondary,
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
            backgroundColor: colors.surfaceAlt,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text
            style={{
              fontSize: fontSize === 's' ? 12 : fontSize === 'm' ? 15 : 18,
              fontWeight: '700',
              color: colors.accent,
            }}
          >
            A
          </Text>
        </Pressable>
      </View>

      {/* New book loaded banner */}
      {newBookLoaded && sentences.length > 0 && (
        <View
          style={{
            backgroundColor: colors.accentBg,
            borderBottomWidth: 1,
            borderBottomColor: colors.accent,
            paddingVertical: 12,
            paddingHorizontal: 20,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <Text style={{ fontSize: 18 }}>📖</Text>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: colors.textPrimary }}>
              {currentBook?.title} loaded
            </Text>
            <Text style={{ fontSize: 12, color: colors.textSecondary, marginTop: 2 }}>
              Tap play to start listening
            </Text>
          </View>
        </View>
      )}

      {/* Reader content */}
      {sentences.length === 0 ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 }}>
          <Text style={{ fontSize: 48, marginBottom: 16 }}>🎧</Text>
          <Text
            style={{
              fontSize: 18,
              fontWeight: '600',
              color: colors.textPrimary,
              textAlign: 'center',
              marginBottom: 8,
            }}
          >
            Ready to listen
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: colors.textSecondary,
              textAlign: 'center',
              lineHeight: 21,
            }}
          >
            Open a book from your library{'\n'}to start your listening session
          </Text>
        </View>
      ) : (
        <WordHighlighter
          sentences={sentences}
          currentSentenceIndex={tts.currentSentenceIndex}
          currentWordIndex={tts.currentWordIndex}
          fontSize={fontSize}
          onJumpTo={onJumpTo}
          contentContainerStyle={{ paddingBottom: 120 }}
        />
      )}

      {/* Playback bar */}
      <PlaybackBar
        isPlaying={tts.isPlaying}
        onPlayPause={onPlayPause}
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
