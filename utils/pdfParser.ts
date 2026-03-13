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
      pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;
    }

    let source: any = uri;
    if (file) {
      const buffer = await file.arrayBuffer();
      source = { data: new Uint8Array(buffer) };
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
