import { Platform } from 'react-native';

export interface ParsedPdf {
  pages: string[];
  fullText: string;
  title?: string;
}

export async function parsePdf(uri: string, file?: File): Promise<ParsedPdf> {
  if (Platform.OS === 'web') {
    const pdfjs = await import('pdfjs-dist');

    if (!pdfjs.GlobalWorkerOptions.workerSrc) {
      // Use jsDelivr to serve exact npm package version (cdnjs may have version mismatch)
      pdfjs.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
    }

    let source: { url?: string; data?: Uint8Array } | string;
    if (file) {
      const buffer = await file.arrayBuffer();
      source = { data: new Uint8Array(buffer) };
    } else if (typeof uri === 'string' && (uri.startsWith('blob:') || uri.startsWith('data:'))) {
      // Blob URL or data URL: fetch and pass as ArrayBuffer
      const res = await fetch(uri);
      const buffer = await res.arrayBuffer();
      source = { data: new Uint8Array(buffer) };
    } else {
      source = uri;
    }

    const loadingTask = pdfjs.getDocument(source);
    const pdf = await loadingTask.promise;
    const pages: string[] = [];

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const strings: string[] = (content.items as any[]).map((item) => item.str);
      pages.push(strings.join(' '));
    }

    const fullText = pages.join('\n\n');
    let title: string | undefined;
    try {
      const info = await pdf.getMetadata();
      title = (info?.info as any)?.Title || undefined;
    } catch {}

    return { pages, fullText, title };
  }

  const placeholder = 'Text extraction from PDF is limited on this platform.';
  return {
    pages: [placeholder],
    fullText: placeholder,
  };
}
