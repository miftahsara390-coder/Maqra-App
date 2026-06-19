export type Language = 'ar' | 'fr' | 'amz' | 'en';
export type ReadStatus = 'to_read' | 'reading' | 'completed';

export interface Book {
  id: string;
  title: string;
  author: string;
  coverColor: string; // used as placeholder color when no image
  coverImage?: any;
  language: Language;
  status: ReadStatus;
  totalPages: number;
  currentPage: number;
  rating?: number; // 1–5
  addedAt: string; // ISO date string
}

export interface ReadingSession {
  id: string;
  bookId: string;
  startedAt: string;
  duration: number; // seconds
  pagesRead: number;
}
