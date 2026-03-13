import React from 'react';
import { Pressable, Text, View } from 'react-native';

interface WordHighlighterProps {
  sentences: string[];
  currentSentenceIndex: number;
  currentWordIndex: number;
  fontSize: 's' | 'm' | 'l';
  onJumpTo: (sentenceIndex: number, wordIndex: number) => void;
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

export const WordHighlighter: React.FC<WordHighlighterProps> = ({
  sentences,
  currentSentenceIndex,
  currentWordIndex,
  fontSize,
  onJumpTo,
}) => {
  const size = fontSizes[fontSize];
  const lh = lineHeights[fontSize];

  return (
    <View style={{ paddingHorizontal: 22, paddingVertical: 24 }}>
      {sentences.map((sentence, sIndex) => {
        const words = sentence.split(/\s+/).filter(Boolean);
        const isCurrentSentence = sIndex === currentSentenceIndex;

        return (
          <Pressable
            key={sIndex}
            onPress={() => onJumpTo(sIndex, 0)}
            style={{
              marginBottom: 8,
              paddingVertical: 4,
              paddingHorizontal: 6,
              borderRadius: 8,
              backgroundColor: isCurrentSentence ? 'rgba(245,166,35,0.08)' : 'transparent',
              borderLeftWidth: isCurrentSentence ? 2 : 0,
              borderLeftColor: '#F5A623',
            }}
          >
            <Text style={{ fontSize: size, lineHeight: lh, color: '#F0EFE9' }}>
              {words.map((word, wIndex) => {
                const isCurrentWord = isCurrentSentence && wIndex === currentWordIndex;
                return (
                  <Text
                    key={wIndex}
                    onPress={() => onJumpTo(sIndex, wIndex)}
                    style={{
                      color: isCurrentWord ? '#0F1014' : isCurrentSentence ? '#F0EFE9' : '#8A8780',
                      backgroundColor: isCurrentWord ? '#F5A623' : 'transparent',
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
      })}
    </View>
  );
};
