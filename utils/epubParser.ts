export interface EpubChapter {
  title: string;
  text: string;
}

export interface ParsedEpub {
  chapters: EpubChapter[];
  title: string;
  author?: string;
  cover?: string;
}

function stripHtml(html: string): string {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<\/(p|div|h[1-6]|li)>/gi, '$&\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+\n/g, '\n')
    .replace(/\n{2,}/g, '\n\n')
    .trim();
}

export async function parseEpub(uri: string, file?: File): Promise<ParsedEpub> {
  if (typeof window !== 'undefined') {
    const e = await import('epubjs');
    const ePub = (e as any).default || (e as any);

    let book: any;
    if (file) {
      const buffer = await file.arrayBuffer();
      book = ePub(buffer);
    } else {
      book = ePub(uri);
    }
    await book.ready;

    const spineItems = book.spine?.items || [];
    const chapters: EpubChapter[] = [];

    for (const item of spineItems) {
      try {
        const doc = await item.load(book.load.bind(book));
        const html = doc?.body?.innerHTML || '';
        const title = item?.id || 'Chapter';
        const text = stripHtml(html);
        if (text.length > 0) {
          chapters.push({ title, text });
        }
        item.unload();
      } catch {
        // Skip unreadable spine items
      }
    }

    const metadata = await book.loaded.metadata;

    return {
      chapters,
      title: metadata?.title || 'Untitled',
      author: metadata?.creator,
      cover: undefined,
    };
  }

  return {
    chapters: [
      {
        title: 'Unsupported EPUB',
        text: 'EPUB text extraction is not fully implemented on this platform yet.',
      },
    ],
    title: 'EPUB',
  };
}
