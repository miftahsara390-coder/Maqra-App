import type { Language, ReadStatus } from '@/types/book';

export const LANGUAGE_LABELS: Record<Language, string> = {
  fr:  'Français',
  ar:  'العربية',
  amz: 'ⵜⴰⵎⴰⵣⵉⵖⵜ',
};

export const STATUS_LABELS: Record<ReadStatus, string> = {
  to_read:   'À lire',
  reading:   'En cours',
  completed: 'Terminé',
};

export const LANGUAGE_OPTIONS: { value: Language | 'all'; label: string }[] = [
  { value: 'all', label: 'Toutes' },
  { value: 'fr',  label: 'Français' },
  { value: 'ar',  label: 'العربية' },
  { value: 'amz', label: 'Tamazight' },
];

export const STATUS_OPTIONS: { value: ReadStatus | 'all'; label: string }[] = [
  { value: 'all',       label: 'Tous' },
  { value: 'to_read',   label: 'À lire' },
  { value: 'reading',   label: 'En cours' },
  { value: 'completed', label: 'Terminé' },
];
