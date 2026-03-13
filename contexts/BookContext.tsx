import React, { createContext, useContext, useState, useCallback } from 'react';
import { Platform } from 'react-native';
import { parsePdf } from '../utils/pdfParser';
import { parseEpub } from '../utils/epubParser';
import { chunkText, ChunkResult } from '../utils/textChunker';

export type BookFileType = 'pdf' | 'epub' | 'txt';

export interface LoadedBook {
  id: string;
  title: string;
  author?: string;
  type: BookFileType;
  uri: string;
  sentences: string[];
  wordMap: ChunkResult['wordMap'];
}

interface BookContextValue {
  currentBook: LoadedBook | null;
  loading: boolean;
  loadFromFile: (params: { uri: string; name: string; file?: File }) => Promise<LoadedBook | null>;
  loadFromText: (params: { text: string; title: string; author?: string; uri: string }) => LoadedBook | null;
  clearBook: () => void;
}

const BookContext = createContext<BookContextValue | null>(null);

function detectFileType(name: string): BookFileType | null {
  const lower = name.toLowerCase();
  if (lower.endsWith('.pdf')) return 'pdf';
  if (lower.endsWith('.epub')) return 'epub';
  if (lower.endsWith('.txt')) return 'txt';
  return null;
}

export function BookProvider({ children }: { children: React.ReactNode }) {
  const [currentBook, setCurrentBook] = useState<LoadedBook | null>(null);
  const [loading, setLoading] = useState(false);

  const loadFromFile = useCallback(
    async ({ uri, name, file }: { uri: string; name: string; file?: File }): Promise<LoadedBook | null> => {
      const type = detectFileType(name);
      if (!type) return null;

      setLoading(true);
      try {
        let text = '';
        let title = name.replace(/\.[^.]+$/, '');
        let author: string | undefined;

        if (type === 'pdf') {
          const parsed = await parsePdf(uri, file);
          text = parsed.fullText;
          title = parsed.title || title;
        } else if (type === 'epub') {
          const parsed = await parseEpub(uri, file);
          title = parsed.title || title;
          author = parsed.author;
          text = parsed.chapters.map((c) => c.text).join('\n\n');
        } else if (type === 'txt') {
          if (file) {
            text = await file.text();
          } else {
            const response = await fetch(uri);
            text = await response.text();
          }
        }

        if (!text.trim()) {
          console.warn('No text extracted from file');
          return null;
        }

        const chunks = chunkText(text);
        const loaded: LoadedBook = {
          id: `${Date.now()}-${name}`,
          title,
          author,
          type,
          uri,
          sentences: chunks.sentences,
          wordMap: chunks.wordMap,
        };
        setCurrentBook(loaded);
        return loaded;
      } catch (e) {
        console.warn('Failed to load book', e);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const loadFromText = useCallback(
    ({ text, title, author, uri }: { text: string; title: string; author?: string; uri: string }): LoadedBook | null => {
      if (!text.trim()) return null;
      const chunks = chunkText(text);
      const loaded: LoadedBook = {
        id: `${Date.now()}-${title}`,
        title,
        author,
        type: 'txt',
        uri,
        sentences: chunks.sentences,
        wordMap: chunks.wordMap,
      };
      setCurrentBook(loaded);
      return loaded;
    },
    []
  );

  const clearBook = useCallback(() => {
    setCurrentBook(null);
  }, []);

  return (
    <BookContext.Provider value={{ currentBook, loading, loadFromFile, loadFromText, clearBook }}>
      {children}
    </BookContext.Provider>
  );
}

export function useBookContext(): BookContextValue {
  const ctx = useContext(BookContext);
  if (!ctx) throw new Error('useBookContext must be used within a BookProvider');
  return ctx;
}
