import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface LibraryBook {
  id: string;
  title: string;
  author?: string;
  type: 'pdf' | 'epub' | 'txt';
  uri: string;
  progressSentence: number;
  progressWord: number;
}

const STORAGE_KEY = 'storysound.library';

export function useLibrary() {
  const [books, setBooks] = useState<LibraryBook[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          setBooks(JSON.parse(stored));
        }
      } catch (e) {
        console.warn('Failed to load library', e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const persist = async (next: LibraryBook[]) => {
    setBooks(next);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch (e) {
      console.warn('Failed to save library', e);
    }
  };

  const addBook = async (book: LibraryBook) => {
    const existing = books.filter((b) => b.id !== book.id);
    await persist([...existing, book]);
  };

  const removeBook = async (id: string) => {
    await persist(books.filter((b) => b.id !== id));
  };

  const updateProgress = async (id: string, progressSentence: number, progressWord: number) => {
    const next = books.map((b) =>
      b.id === id
        ? {
            ...b,
            progressSentence,
            progressWord,
          }
        : b
    );
    await persist(next);
  };

  return {
    books,
    loading,
    addBook,
    removeBook,
    updateProgress,
  };
}

