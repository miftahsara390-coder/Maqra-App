import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Colors, Radii, Shadows, Spacing } from '@/constants/colors';
import { LANGUAGE_LABELS, STATUS_LABELS } from '@/constants/languages';
import type { Book } from '@/types/book';

interface BookCardProps {
  book: Book;
  onPress: () => void;
}

const STATUS_COLORS = {
  to_read:   { bg: Colors.surfaceContainerHigh, text: Colors.onSurfaceVariant },
  reading:   { bg: Colors.secondaryContainer,   text: Colors.onSecondaryContainer },
  completed: { bg: Colors.tertiaryContainer,    text: Colors.onTertiaryContainer },
};

const LANGUAGE_COLORS = {
  fr:  { bg: Colors.onPrimaryContainer, text: Colors.primary },
  ar:  { bg: Colors.secondaryContainer + '55', text: Colors.secondary },
  amz: { bg: Colors.onTertiaryContainer + '55', text: Colors.tertiary },
};

export default function BookCard({ book, onPress }: BookCardProps) {
  const statusColor   = STATUS_COLORS[book.status];
  const languageColor = LANGUAGE_COLORS[book.language];
  const progress      = book.totalPages > 0 ? book.currentPage / book.totalPages : 0;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    >
      {/* Cover art placeholder */}
      <View style={[styles.cover, { backgroundColor: book.coverColor }]}>
        {/* Zellige diagonal accent on cover */}
        <View style={styles.coverAccent} />
        <Text style={styles.coverInitial} numberOfLines={1}>
          {book.title.charAt(0)}
        </Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Badges row */}
        <View style={styles.badgesRow}>
          {/* Language badge */}
          <View style={[styles.badge, { backgroundColor: languageColor.bg }]}>
            <Text style={[styles.badgeText, { color: languageColor.text }]}>
              {LANGUAGE_LABELS[book.language]}
            </Text>
          </View>

          {/* Status badge */}
          <View style={[styles.badge, { backgroundColor: statusColor.bg }]}>
            <Text style={[styles.badgeText, { color: statusColor.text }]}>
              {STATUS_LABELS[book.status]}
            </Text>
          </View>
        </View>

        {/* Title */}
        <Text style={styles.title} numberOfLines={2}>{book.title}</Text>

        {/* Author */}
        <Text style={styles.author} numberOfLines={1}>{book.author}</Text>

        {/* Progress bar */}
        {book.status !== 'to_read' && (
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${Math.round(progress * 100)}%`,
                  backgroundColor:
                    book.status === 'completed'
                      ? Colors.mintGreen
                      : Colors.majorelleBlue,
                },
              ]}
            />
          </View>
        )}

        {/* Pages indicator */}
        {book.status !== 'to_read' && (
          <Text style={styles.pages}>
            {book.currentPage} / {book.totalPages} pages
          </Text>
        )}
      </View>
    </Pressable>
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
    ...Shadows.card,
  },
  cardPressed: {
    opacity: 0.92,
    ...Shadows.active,
  },

  // ── Cover ──────────────────────────────────────────────────────────────────
  cover: {
    width: 90,
    alignSelf: 'stretch',
    borderTopLeftRadius: 0,   // clipped by card
    borderBottomLeftRadius: 0,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  coverAccent: {
    position: 'absolute',
    width: 70,
    height: 70,
    borderRadius: 4,
    borderWidth: 8,
    borderColor: 'rgba(255,255,255,0.12)',
    transform: [{ rotate: '30deg' }],
    top: -20,
    right: -20,
  },
  coverInitial: {
    fontSize: 32,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
  },

  // ── Content ────────────────────────────────────────────────────────────────
  content: {
    flex: 1,
    padding: Spacing.md,
    gap: Spacing.xs,
  },
  badgesRow: {
    flexDirection: 'row',
    gap: Spacing.xs,
    flexWrap: 'wrap',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radii.md,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.onSurface,
    lineHeight: 20,
    marginTop: 2,
  },
  author: {
    fontSize: 13,
    fontWeight: '400',
    color: Colors.onSurfaceVariant,
  },
  progressTrack: {
    height: 4,
    backgroundColor: Colors.majorelleBlue + '1A',
    borderRadius: Radii.full,
    marginTop: Spacing.xs,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: Radii.full,
  },
  pages: {
    fontSize: 11,
    color: Colors.outline,
    fontWeight: '500',
  },
});
