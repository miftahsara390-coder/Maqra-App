import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Book, ReadingSession } from '../types/book';

interface UserProfile {
  name: string;
  avatarUri?: string;
  annualGoal: number;
}

interface BookState {
  books: Book[];
  sessions: ReadingSession[];
  userProfile: UserProfile;
  addBook: (book: Omit<Book, 'id' | 'addedAt'>) => void;
  updateBookProgress: (bookId: string, currentPage: number) => void;
  updateBookStatus: (bookId: string, status: Book['status']) => void;
  deleteBook: (bookId: string) => void;
  addSession: (session: Omit<ReadingSession, 'id'>) => void;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
}

const DEFAULT_BOOKS: Book[] = [
  {
    id: '1',
    title: 'Le Pain Nu',
    author: 'Mohamed Choukri',
    coverColor: '#4734C3',
    coverImage: require('../assets/images/cover1.jpg'),
    language: 'fr',
    status: 'reading',
    totalPages: 320,
    currentPage: 150,
    addedAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'La Civilisation, ma Mère !',
    author: 'Driss Chraïbi',
    coverColor: '#9F402D',
    coverImage: require('../assets/images/cover2.jpg'),
    language: 'fr',
    status: 'to_read',
    totalPages: 240,
    currentPage: 0,
    addedAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'موسم الهجرة إلى الشمال',
    author: 'الطيب صالح',
    coverColor: '#005A40',
    coverImage: require('../assets/images/cover3.jpg'),
    language: 'ar',
    status: 'completed',
    totalPages: 180,
    currentPage: 180,
    addedAt: new Date().toISOString(),
  },
  {
    id: '4',
    title: 'Le Petit Prince',
    author: 'Antoine de Saint-Exupéry',
    coverColor: '#D4AF37',
    coverImage: require('../assets/images/cover4.jpg'),
    language: 'fr',
    status: 'to_read',
    totalPages: 96,
    currentPage: 0,
    addedAt: new Date().toISOString(),
  },
  {
    id: '5',
    title: 'L\'Étranger',
    author: 'Albert Camus',
    coverColor: '#A52A2A',
    coverImage: require('../assets/images/cover5.jpg'),
    language: 'fr',
    status: 'completed',
    totalPages: 123,
    currentPage: 123,
    addedAt: new Date().toISOString(),
  },
  {
    id: '6',
    title: '1984',
    author: 'George Orwell',
    coverColor: '#4A4A4A',
    coverImage: require('../assets/images/cover6.jpg'),
    language: 'en',
    status: 'reading',
    totalPages: 328,
    currentPage: 120,
    addedAt: new Date().toISOString(),
  },
  {
    id: '7',
    title: 'Tifinagh — Poésie Amazighe',
    author: 'Fatima Tabaamrant',
    coverColor: '#005A40',
    coverImage: require('../assets/images/cover7.jpg'),
    language: 'amz',
    status: 'to_read',
    totalPages: 184,
    currentPage: 0,
    addedAt: new Date().toISOString(),
  }
];

export const useBookStore = create<BookState>()(
  persist(
    (set) => ({
      books: DEFAULT_BOOKS,
      sessions: [],
      userProfile: {
        name: 'Lecteur Passionné',
        annualGoal: 25,
      },

      addBook: (newBook) =>
        set((state) => ({
          books: [
            ...state.books,
            {
              ...newBook,
              id: Math.random().toString(36).substring(2, 9),
              addedAt: new Date().toISOString(),
            },
          ],
        })),

      updateBookProgress: (bookId, currentPage) =>
        set((state) => ({
          books: state.books.map((book) => {
            if (book.id !== bookId) return book;
            const isCompleted = currentPage >= book.totalPages;
            return {
              ...book,
              currentPage,
              status: isCompleted ? 'completed' : 'reading',
            };
          }),
        })),

      updateBookStatus: (bookId, status) =>
        set((state) => ({
          books: state.books.map((book) =>
            book.id === bookId ? { ...book, status } : book
          ),
        })),

      deleteBook: (bookId) =>
        set((state) => ({
          books: state.books.filter((book) => book.id !== bookId),
          sessions: state.sessions.filter((session) => session.bookId !== bookId),
        })),

      addSession: (newSession) =>
        set((state) => ({
          sessions: [
            ...state.sessions,
            {
              ...newSession,
              id: Math.random().toString(36).substring(2, 9),
            },
          ],
        })),

      updateUserProfile: (profile) =>
        set((state) => ({
          userProfile: { ...state.userProfile, ...profile },
        })),
    }),
    {
      name: 'maqra-storage', // unique name for AsyncStorage key
      storage: createJSONStorage(() => AsyncStorage),
      version: 8,
      migrate: (persistedState: any, version: number) => {
        if (version < 8) {
          // Replace old books (with broken remote images) with the new DEFAULT_BOOKS (with local assets)
          return {
            ...persistedState,
            books: DEFAULT_BOOKS,
          };
        }
        return persistedState;
      },
    }
  )
);
