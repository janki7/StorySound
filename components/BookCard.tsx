import React from 'react';
import { Pressable, Text, View } from 'react-native';

export interface BookCardProps {
  title: string;
  author?: string;
  progress: number;
  onPress?: () => void;
  onLongPress?: () => void;
  /** When provided with onOpenBook, enables memo-friendly callback pattern */
  book?: { id: string };
  onOpenBook?: (book: { id: string }) => void;
  onRemoveBook?: (id: string) => void;
  color1?: string;
  color2?: string;
  compact?: boolean;
}

const PALETTE = [
  ['#E07A5F', '#81171B'],
  ['#3D5A80', '#1B263B'],
  ['#56AB91', '#2B6777'],
  ['#C06C84', '#6C5B7B'],
  ['#D4A843', '#8B6914'],
  ['#6D72C3', '#2D3191'],
];

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

export const BookCard = React.memo<BookCardProps>(({
  title,
  author,
  progress,
  onPress,
  onLongPress,
  book,
  onOpenBook,
  onRemoveBook,
  color1,
  color2,
  compact,
}) => {
  const handlePress = onOpenBook && book ? () => onOpenBook(book) : onPress;
  const handleLongPress = onRemoveBook && book ? () => onRemoveBook(book.id) : onLongPress;
  const percentage = Math.round(progress * 100);
  const idx = hashString(title) % PALETTE.length;
  const c1 = color1 || PALETTE[idx][0];
  const c2 = color2 || PALETTE[idx][1];

  if (compact) {
    return (
      <Pressable
        onPress={handlePress}
        onLongPress={handleLongPress}
        style={{
          width: 140,
          marginRight: 12,
          borderRadius: 12,
          overflow: 'hidden',
        }}
      >
        <View
          style={{
            height: 180,
            backgroundColor: c2,
            borderRadius: 12,
            padding: 14,
            justifyContent: 'flex-end',
          }}
        >
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              borderRadius: 12,
              backgroundColor: c1,
              opacity: 0.7,
            }}
          />
          <View
            style={{
              position: 'absolute',
              top: 12,
              right: 12,
              width: 40,
              height: 3,
              backgroundColor: 'rgba(255,255,255,0.3)',
              borderRadius: 2,
            }}
          />
          <View
            style={{
              position: 'absolute',
              top: 12,
              right: 12,
              width: 40 * (progress || 0),
              height: 3,
              backgroundColor: '#fff',
              borderRadius: 2,
            }}
          />
          <Text
            numberOfLines={2}
            style={{
              fontSize: 14,
              fontWeight: '700',
              color: '#fff',
              lineHeight: 18,
              zIndex: 1,
            }}
          >
            {title}
          </Text>
          {author ? (
            <Text
              numberOfLines={1}
              style={{
                fontSize: 11,
                color: 'rgba(255,255,255,0.7)',
                marginTop: 4,
                zIndex: 1,
              }}
            >
              {author}
            </Text>
          ) : null}
        </View>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={handlePress}
      onLongPress={handleLongPress}
      style={{
        flex: 1,
        margin: 6,
        borderRadius: 14,
        overflow: 'hidden',
        maxWidth: '48%',
      }}
    >
      <View
        style={{
          height: 200,
          backgroundColor: c2,
          borderRadius: 14,
          padding: 16,
          justifyContent: 'flex-end',
        }}
      >
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            borderRadius: 14,
            backgroundColor: c1,
            opacity: 0.65,
          }}
        />
        {/* Decorative top element */}
        <View
          style={{
            position: 'absolute',
            top: 16,
            left: 16,
            right: 16,
            height: 3,
            backgroundColor: 'rgba(255,255,255,0.15)',
            borderRadius: 2,
          }}
        />
        {/* Progress bar */}
        {percentage > 0 && (
          <View
            style={{
              position: 'absolute',
              top: 16,
              left: 16,
              width: `${percentage}%`,
              maxWidth: '70%',
              height: 3,
              backgroundColor: '#F5A623',
              borderRadius: 2,
            }}
          />
        )}
        {/* Genre badge / percentage */}
        {percentage > 0 && (
          <View
            style={{
              position: 'absolute',
              top: 28,
              left: 16,
              backgroundColor: 'rgba(0,0,0,0.35)',
              paddingHorizontal: 8,
              paddingVertical: 3,
              borderRadius: 8,
            }}
          >
            <Text style={{ fontSize: 10, color: '#F5A623', fontWeight: '600' }}>
              {percentage}%
            </Text>
          </View>
        )}
        <Text
          numberOfLines={3}
          style={{
            fontSize: 16,
            fontWeight: '700',
            color: '#fff',
            lineHeight: 21,
            zIndex: 1,
            textShadowColor: undefined,
          }}
        >
          {title}
        </Text>
        {author ? (
          <Text
            numberOfLines={1}
            style={{
              fontSize: 12,
              color: 'rgba(255,255,255,0.75)',
              marginTop: 4,
              zIndex: 1,
            }}
          >
            {author}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
});
