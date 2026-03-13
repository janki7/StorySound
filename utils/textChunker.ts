export interface WordMapEntry {
  sentenceIndex: number;
  wordIndex: number;
  char: number;
}

export interface ChunkResult {
  sentences: string[];
  wordMap: WordMapEntry[];
}

// Simple sentence splitter that attempts to respect common abbreviations.
const abbreviationPattern = /\b(?:Mr|Mrs|Ms|Dr|Prof|Sr|Jr|St|vs|etc)\.$/;

export function chunkText(fullText: string): ChunkResult {
  const cleaned = fullText.replace(/\s+/g, ' ').trim();
  if (!cleaned) {
    return { sentences: [], wordMap: [] };
  }

  const sentences: string[] = [];
  const wordMap: WordMapEntry[] = [];

  let current = '';
  let globalCharIndex = 0;

  for (let i = 0; i < cleaned.length; i++) {
    const char = cleaned[i];
    current += char;

    const atEnd = i === cleaned.length - 1;
    const isBoundary = /[.!?]/.test(char);
    const nextChar = cleaned[i + 1] || ' ';

    if (atEnd || (isBoundary && /\s/.test(nextChar) && !abbreviationPattern.test(current.trim()))) {
      const sentence = current.trim();
      if (sentence.length > 0) {
        const sentenceIndex = sentences.length;
        const words = sentence.split(/\s+/).filter(Boolean);
        let localChar = 0;
        words.forEach((word, wordIndex) => {
          wordMap.push({
            sentenceIndex,
            wordIndex,
            char: globalCharIndex + localChar,
          });
          localChar += word.length + 1;
        });
        sentences.push(sentence);
        globalCharIndex += current.length;
        current = '';
      }
    }
  }

  return { sentences, wordMap };
}

