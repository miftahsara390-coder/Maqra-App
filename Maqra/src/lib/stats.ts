import { Book, ReadingSession } from '../types/book';

export function calculateTotalPagesRead(sessions: ReadingSession[]) {
  return sessions.reduce((total, session) => total + session.pagesRead, 0);
}

export function calculateTotalReadingTime(sessions: ReadingSession[]) {
  return sessions.reduce((total, session) => total + session.duration, 0);
}

export function calculateReadingStreak(sessions: ReadingSession[]) {
  if (sessions.length === 0) return 0;

  // Sort sessions by date descending
  const sortedDates = sessions
    .map((s) => new Date(s.startedAt).setHours(0, 0, 0, 0))
    .sort((a, b) => b - a);

  // Remove duplicates (multiple sessions on same day count as 1 day)
  const uniqueDays = Array.from(new Set(sortedDates));

  let streak = 0;
  const today = new Date().setHours(0, 0, 0, 0);
  const oneDay = 24 * 60 * 60 * 1000;

  // Streak continues if they read today OR yesterday
  let expectedNextDay = uniqueDays[0] === today ? today : today - oneDay;

  for (const day of uniqueDays) {
    if (day === expectedNextDay) {
      streak++;
      expectedNextDay -= oneDay;
    } else {
      break;
    }
  }

  return streak;
}

export function formatDuration(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  
  if (h > 0) {
    return `${h}h${m > 0 ? ` ${m}m` : ''}`;
  }
  return `${m}m`;
}
