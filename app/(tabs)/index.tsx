import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';
import { useLibrary } from '../../hooks/useLibrary';
import { useBookContext } from '../../contexts/BookContext';
import { useSettings } from '../../contexts/SettingsContext';
import { BookCard } from '../../components/BookCard';
import { FREE_BOOKS, READING_QUOTES, FreeBook } from '../../data/freeBooks';
import type { LibraryBook } from '../../hooks/useLibrary';

export default function LibraryScreen() {
  const router = useRouter();
  const { colors } = useSettings();
  const { books, loading, addBook, removeBook } = useLibrary();
  const { loadFromFile, loadFromText, currentBook } = useBookContext();
  const [loadingFreeBook, setLoadingFreeBook] = useState<string | null>(null);

  const quote = useMemo(() => {
    const idx = Math.floor(Date.now() / 86400000) % READING_QUOTES.length;
    return READING_QUOTES[idx];
  }, []);

  const handleOpenBook = useCallback(
    async (item: LibraryBook) => {
      if (currentBook?.id !== item.id) {
        const fetchUri = item.uri.startsWith('https://www.gutenberg.org')
          ? `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(item.uri)}`
          : item.uri;
        await loadFromFile({
          uri: fetchUri,
          name: `${item.title}.${item.type}`,
        });
      }
      router.push({
        pathname: '/(tabs)/reader',
        params: { bookId: item.id },
      });
    },
    [currentBook?.id, loadFromFile, router]
  );

  const handleRemoveBook = useCallback(
    (id: string) => {
      removeBook(id);
    },
    [removeBook]
  );

  const importBook = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'application/epub+zip', 'text/plain'],
        copyToCacheDirectory: true,
      });
      if (result.canceled || !result.assets || result.assets.length === 0) return;

      const asset = result.assets[0];
      const webFile =
        Platform.OS === 'web' ? ((asset as any).file as File | undefined) : undefined;

      const loaded = await loadFromFile({
        uri: asset.uri,
        name: asset.name || 'Book',
        file: webFile,
      });

      if (loaded) {
        await addBook({
          id: loaded.id,
          title: loaded.title,
          author: loaded.author,
          type: loaded.type,
          uri: loaded.uri,
          progressSentence: 0,
          progressWord: 0,
        });
        router.push({
          pathname: '/(tabs)/reader',
          params: { bookId: loaded.id },
        });
      }
    } catch (e) {
      console.warn('Import failed', e);
    }
  };

  const handleFreeBook = async (book: FreeBook) => {
    setLoadingFreeBook(book.id);
    try {
      const proxyUrl = `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(book.url)}`;
      const response = await fetch(proxyUrl);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const text = await response.text();

      const loaded = loadFromText({
        text,
        title: book.title,
        author: book.author,
        uri: book.url,
      });

      if (loaded) {
        await addBook({
          id: loaded.id,
          title: book.title,
          author: book.author,
          type: 'txt',
          uri: book.url,
          progressSentence: 0,
          progressWord: 0,
        });
        router.push({
          pathname: '/(tabs)/reader',
          params: { bookId: loaded.id },
        });
      }
    } catch (e) {
      console.warn('Failed to load free book', e);
    } finally {
      setLoadingFreeBook(null);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View
          style={{
            paddingHorizontal: 20,
            paddingTop: Platform.OS === 'web' ? 40 : 56,
            paddingBottom: 8,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <View>
            <Text
              style={{
                fontSize: 28,
                fontWeight: '800',
                color: colors.textPrimary,
                letterSpacing: -0.5,
              }}
            >
              StorySound
            </Text>
            <Text style={{ fontSize: 13, color: colors.textSecondary, marginTop: 2 }}>
              Your audiobook companion
            </Text>
          </View>
          <Pressable
            onPress={importBook}
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: colors.accent,
              alignItems: 'center',
              justifyContent: 'center',
              elevation: 8,
            }}
          >
            <Text style={{ fontSize: 24, color: colors.accentOnAccent, fontWeight: '700', marginTop: -2 }}>
              +
            </Text>
          </Pressable>
        </View>

        {/* Motivational quote */}
        <View
          style={{
            marginHorizontal: 20,
            marginTop: 16,
            marginBottom: 24,
            backgroundColor: colors.surface,
            borderRadius: 16,
            padding: 18,
            borderLeftWidth: 3,
            borderLeftColor: colors.accent,
          }}
        >
          <Text
            style={{
              fontSize: 13,
              color: colors.textSecondary,
              lineHeight: 20,
              fontStyle: 'italic',
            }}
          >
            {quote}
          </Text>
        </View>

        {/* My Library section */}
        <View style={{ paddingHorizontal: 20 }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 14,
            }}
          >
            <Text style={{ fontSize: 20, fontWeight: '700', color: colors.textPrimary }}>My Library</Text>
            {books.length > 0 && (
              <Text style={{ fontSize: 12, color: colors.textSecondary }}>
                {books.length} book{books.length !== 1 ? 's' : ''}
              </Text>
            )}
          </View>
        </View>

        {loading ? (
          <View style={{ padding: 40, alignItems: 'center' }}>
            <ActivityIndicator color={colors.accent} />
          </View>
        ) : books.length === 0 ? (
            <View
              style={{
                marginHorizontal: 20,
                backgroundColor: colors.surface,
              borderRadius: 16,
              padding: 32,
              alignItems: 'center',
              borderWidth: 1,
                borderColor: colors.surfaceAlt2,
              borderStyle: 'dashed',
            }}
          >
            <Text style={{ fontSize: 40, marginBottom: 12 }}>📖</Text>
            <Text
              style={{
                fontSize: 16,
                fontWeight: '600',
                color: colors.textPrimary,
                marginBottom: 6,
              }}
            >
              Your library is empty
            </Text>
            <Text
              style={{
                fontSize: 13,
                color: colors.textSecondary,
                textAlign: 'center',
                marginBottom: 20,
                lineHeight: 19,
              }}
            >
              Import your own books or pick a free classic below to get started
            </Text>
            <Pressable
              onPress={importBook}
              style={{
                paddingHorizontal: 28,
                paddingVertical: 13,
                borderRadius: 25,
                backgroundColor: colors.accent,
              }}
            >
              <Text style={{ fontSize: 15, fontWeight: '700', color: colors.accentOnAccent }}>
                Import a Book
              </Text>
            </Pressable>
          </View>
        ) : (
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              paddingHorizontal: 14,
            }}
          >
            {books.map((item) => (
              <BookCard
                key={item.id}
                title={item.title}
                author={item.author}
                progress={item.progressSentence > 0 ? 0.5 : 0}
                book={item}
                onOpenBook={handleOpenBook}
                onRemoveBook={handleRemoveBook}
              />
            ))}
          </View>
        )}

        {/* Free Books section */}
        <View style={{ marginTop: 32 }}>
          <View
            style={{
              paddingHorizontal: 20,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              marginBottom: 14,
            }}
          >
            <View>
              <Text style={{ fontSize: 20, fontWeight: '700', color: colors.textPrimary }}>
                Free Classics
              </Text>
              <Text style={{ fontSize: 12, color: colors.textSecondary, marginTop: 3 }}>
                Tap to listen instantly · Powered by Project Gutenberg
              </Text>
            </View>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingLeft: 20, paddingRight: 8 }}
          >
            {FREE_BOOKS.map((book) => (
              <View key={book.id}>
                {loadingFreeBook === book.id && (
                  <View
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 12,
                      bottom: 0,
                      zIndex: 10,
                      backgroundColor: 'rgba(0,0,0,0.5)' as const,
                      borderRadius: 12,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <ActivityIndicator color={colors.accent} />
                    <Text
                      style={{
                        color: colors.accent,
                        fontSize: 11,
                        marginTop: 8,
                        fontWeight: '600',
                      }}
                    >
                      Loading...
                    </Text>
                  </View>
                )}
                <BookCard
                  compact
                  title={book.title}
                  author={book.author}
                  progress={0}
                  color1={book.color1}
                  color2={book.color2}
                  onPress={() => handleFreeBook(book)}
                />
                <View
                  style={{
                    marginRight: 12,
                    marginTop: 6,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  <View
                    style={{
                      backgroundColor: colors.surfaceAlt,
                      paddingHorizontal: 7,
                      paddingVertical: 2,
                      borderRadius: 6,
                    }}
                  >
                    <Text style={{ fontSize: 9, color: colors.textSecondary, fontWeight: '600' }}>
                      {book.genre}
                    </Text>
                  </View>
                  <Text style={{ fontSize: 9, color: '#3A3B40', marginLeft: 6 }}>FREE</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Import formats info */}
        <View
          style={{
            marginTop: 32,
            marginHorizontal: 20,
            backgroundColor: colors.surface,
            borderRadius: 16,
            padding: 20,
          }}
        >
          <Text style={{ fontSize: 14, fontWeight: '600', color: colors.textPrimary, marginBottom: 12 }}>
            Supported formats
          </Text>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            {['PDF', 'EPUB', 'TXT'].map((fmt) => (
              <View
                key={fmt}
                style={{
                  flex: 1,
                  backgroundColor: colors.surfaceAlt,
                  borderRadius: 10,
                  paddingVertical: 12,
                  alignItems: 'center',
                }}
              >
                <Text style={{ fontSize: 18, marginBottom: 4 }}>
                  {fmt === 'PDF' ? '📄' : fmt === 'EPUB' ? '📕' : '📝'}
                </Text>
                <Text style={{ fontSize: 12, fontWeight: '600', color: colors.textSecondary }}>{fmt}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
