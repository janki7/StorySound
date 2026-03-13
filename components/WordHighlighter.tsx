import React, { useCallback, useEffect, useRef } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { useSettings } from '../contexts/SettingsContext';

interface WordHighlighterProps {
  sentences: string[];
  currentSentenceIndex: number;
  currentWordIndex: number;
  fontSize: 's' | 'm' | 'l';
  onJumpTo: (sentenceIndex: number, wordIndex: number) => void;
  contentContainerStyle?: { paddingBottom?: number };
}

const fontSizes: Record<WordHighlighterProps['fontSize'], number> = {
  s: 15,
  m: 18,
  l: 22,
};

const lineHeights: Record<WordHighlighterProps['fontSize'], number> = {
  s: 24,
  m: 30,
  l: 36,
};


interface SentenceRowProps {
  sentence: string;
  sIndex: number;
  currentSentenceIndex: number;
  currentWordIndex: number;
  size: number;
  lh: number;
  onJumpTo: (sentenceIndex: number, wordIndex: number) => void;
  textColor: string;
  mutedColor: string;
  accentColor: string;
  accentOnAccent: string;
  accentBg: string;
}

const baseSentenceStyle = {
  marginBottom: 8,
  paddingVertical: 4,
  paddingHorizontal: 6,
  borderRadius: 8,
};

const SentenceRow = React.memo<SentenceRowProps>(
  ({ sentence, sIndex, currentSentenceIndex, currentWordIndex, size, lh, onJumpTo, textColor, mutedColor, accentColor, accentOnAccent, accentBg }) => {
    const words = sentence.split(/\s+/).filter(Boolean);
    const isCurrentSentence = sIndex === currentSentenceIndex;

    return (
      <Pressable
        onPress={() => onJumpTo(sIndex, 0)}
        style={[
          baseSentenceStyle,
          {
            backgroundColor: isCurrentSentence ? accentBg : 'transparent',
            borderLeftWidth: isCurrentSentence ? 2 : 0,
            borderLeftColor: accentColor,
          },
        ]}
      >
        <Text style={{ fontSize: size, lineHeight: lh, color: textColor }}>
          {words.map((word, wIndex) => {
            const isCurrentWord = isCurrentSentence && wIndex === currentWordIndex;
            return (
              <Text
                key={wIndex}
                onPress={() => onJumpTo(sIndex, wIndex)}
                style={{
                  color: isCurrentWord ? accentOnAccent : isCurrentSentence ? textColor : mutedColor,
                  backgroundColor: isCurrentWord ? accentColor : 'transparent',
                  borderRadius: 4,
                  fontWeight: isCurrentWord ? '700' : '400',
                }}
              >
                {isCurrentWord ? ` ${word} ` : word}
                {wIndex < words.length - 1 ? ' ' : ''}
              </Text>
            );
          })}
        </Text>
      </Pressable>
    );
  }
);

export const WordHighlighter: React.FC<WordHighlighterProps> = ({
  sentences,
  currentSentenceIndex,
  currentWordIndex,
  fontSize,
  onJumpTo,
  contentContainerStyle,
}) => {
  const { colors } = useSettings();
  const size = fontSizes[fontSize];
  const lh = lineHeights[fontSize];

  const renderItem = useCallback(
    ({ item, index }: { item: string; index: number }) => (
      <SentenceRow
        sentence={item}
        sIndex={index}
        currentSentenceIndex={currentSentenceIndex}
        currentWordIndex={currentWordIndex}
        size={size}
        lh={lh}
        onJumpTo={onJumpTo}
        textColor={colors.textPrimary}
        mutedColor={colors.textMuted}
        accentColor={colors.accent}
        accentOnAccent={colors.accentOnAccent}
        accentBg={colors.accentBgSubtle}
      />
    ),
    [currentSentenceIndex, currentWordIndex, size, lh, onJumpTo, colors]
  );

  const keyExtractor = useCallback((_: string, index: number) => String(index), []);

  const flatListRef = useRef<FlatList>(null);

  // Scroll to follow the narrator
  useEffect(() => {
    if (sentences.length === 0 || currentSentenceIndex < 0) return;
    flatListRef.current?.scrollToIndex({
      index: currentSentenceIndex,
      viewPosition: 0.3,
      animated: true,
    });
  }, [currentSentenceIndex, sentences.length]);

  return (
    <View style={{ paddingHorizontal: 22, paddingVertical: 24, flex: 1 }}>
      <FlatList
        ref={flatListRef}
        data={sentences}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        extraData={{ currentSentenceIndex, currentWordIndex }}
        initialNumToRender={15}
        maxToRenderPerBatch={10}
        windowSize={10}
        removeClippedSubviews={true}
        contentContainerStyle={contentContainerStyle}
        showsVerticalScrollIndicator={false}
        onScrollToIndexFailed={() => {}}
      />
    </View>
  );
};
