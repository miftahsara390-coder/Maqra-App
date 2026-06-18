/**
 * SessionCard — displays a single past reading session entry in the history list.
 * UI only, no business logic.
 */
import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Colors, Radii, Shadows, Spacing } from '@/constants/colors';
import type { ReadingSession } from '@/types/book';

interface SessionCardProps {
  session: ReadingSession;
  bookTitle: string;
  onDelete?: () => void;
}

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}min`;
  return `${m} min`;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('fr-MA', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export default function SessionCard({ session, bookTitle, onDelete }: SessionCardProps) {
  return (
    <View style={styles.card}>
      {/* Accent strip */}
      <View style={styles.strip} />

      <View style={styles.body}>
        {/* Book title */}
        <Text style={styles.bookTitle} numberOfLines={1}>{bookTitle}</Text>

        {/* Meta row */}
        <View style={styles.metaRow}>
          {/* Clock icon representation */}
          <View style={styles.metaItem}>
            <View style={styles.dotClock} />
            <Text style={styles.metaText}>{formatDuration(session.duration)}</Text>
          </View>

          <View style={styles.metaDivider} />

          {/* Pages */}
          <View style={styles.metaItem}>
            <View style={styles.dotPage} />
            <Text style={styles.metaText}>{session.pagesRead} pages</Text>
          </View>

          <View style={styles.metaDivider} />

          {/* Date */}
          <Text style={styles.dateText}>{formatDate(session.startedAt)}</Text>
        </View>
      </View>

      {/* Delete button */}
      {onDelete && (
        <Pressable
          onPress={onDelete}
          style={({ pressed }) => [styles.deleteBtn, pressed && { opacity: 0.6 }]}
          accessibilityLabel="Supprimer cette session"
        >
          <Text style={styles.deleteIcon}>×</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: Radii.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    alignItems: 'center',
    ...Shadows.card,
  },
  strip: {
    width: 4,
    alignSelf: 'stretch',
    backgroundColor: Colors.majorelleBlue,
  },
  body: {
    flex: 1,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    gap: Spacing.xs,
  },
  bookTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.onSurface,
    letterSpacing: -0.2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    flexWrap: 'wrap',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dotClock: {
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: Colors.majorelleBlue,
  },
  dotPage: {
    width: 8,
    height: 8,
    borderRadius: 1,
    backgroundColor: Colors.terracotta,
  },
  metaText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.onSurfaceVariant,
  },
  metaDivider: {
    width: 1,
    height: 10,
    backgroundColor: Colors.outlineVariant,
  },
  dateText: {
    fontSize: 12,
    color: Colors.outline,
    fontWeight: '400',
  },
  deleteBtn: {
    paddingHorizontal: Spacing.md,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteIcon: {
    fontSize: 20,
    color: Colors.outline,
    fontWeight: '300',
  },
});
