/**
 * Book Detail & Reading Session — Screen 2 (UI only, no business logic)
 *
 * Displays:
 *  - Book cover + info header
 *  - Animated progress ring + page input
 *  - Stopwatch / session timer controls (Start / Pause / Stop)
 *  - Star rating
 *  - Status selector chips
 *  - Animated counters (pages read, time)
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  TextInput,
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';
import { Colors, Radii, Shadows, Spacing } from '@/constants/colors';
import ProgressRing from '@/components/ProgressRing';
import type { ReadStatus } from '@/types/book';
import { STATUS_LABELS } from '@/constants/languages';

// ── Mock book for display ──────────────────────────────────────────────────────
const MOCK_BOOK = {
  id: '1',
  title: 'Le Passé Simple',
  author: 'Driss Chraïbi',
  coverColor: '#9F402D',
  language: 'fr' as const,
  status: 'reading' as ReadStatus,
  totalPages: 256,
  currentPage: 128,
  rating: 4,
};

const STATUS_OPTIONS: ReadStatus[] = ['to_read', 'reading', 'completed'];

const STATUS_ACCENT: Record<ReadStatus, string> = {
  to_read:   Colors.outline,
  reading:   Colors.terracotta,
  completed: Colors.mintGreen,
};

export default function BookDetailScreen() {
  const [pageInput,   setPageInput]   = useState(String(MOCK_BOOK.currentPage));
  const [timerState,  setTimerState]  = useState<'idle' | 'running' | 'paused'>('idle');
  const [elapsedSecs, setElapsedSecs] = useState(0); // display only
  const [selectedStatus, setSelectedStatus] = useState<ReadStatus>(MOCK_BOOK.status);
  const [rating, setRating] = useState(MOCK_BOOK.rating);

  const progress = MOCK_BOOK.totalPages > 0
    ? MOCK_BOOK.currentPage / MOCK_BOOK.totalPages
    : 0;

  const formatTime = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return h > 0
      ? `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
      : `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />

      {/* ── Hero cover header ────────────────────────────────────────────────── */}
      <View style={[styles.hero, { backgroundColor: MOCK_BOOK.coverColor }]}>
        {/* Zellige pattern overlay */}
        <View style={styles.zelligeOverlay}>
          {[...Array(6)].map((_, i) => (
            <View key={i} style={[styles.zelligeTile, { opacity: 0.06 + i * 0.01 }]} />
          ))}
        </View>

        {/* Back button */}
        <Pressable style={styles.backBtn} accessibilityLabel="Retour">
          <Text style={styles.backIcon}>‹</Text>
        </Pressable>

        {/* Cover initial */}
        <View style={styles.coverCircle}>
          <Text style={styles.coverLetter}>{MOCK_BOOK.title.charAt(0)}</Text>
        </View>

        {/* Title / author */}
        <Text style={styles.heroTitle}>{MOCK_BOOK.title}</Text>
        <Text style={styles.heroAuthor}>{MOCK_BOOK.author}</Text>

        {/* Star rating */}
        <View style={styles.starsRow}>
          {[1, 2, 3, 4, 5].map((star) => (
            <Pressable key={star} onPress={() => setRating(star)}>
              <Text style={[styles.star, star <= rating && styles.starFilled]}>★</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Status selector ──────────────────────────────────────────────── */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Statut</Text>
          <View style={styles.statusRow}>
            {STATUS_OPTIONS.map((s) => (
              <Pressable
                key={s}
                onPress={() => setSelectedStatus(s)}
                style={[
                  styles.statusChip,
                  selectedStatus === s && {
                    backgroundColor: STATUS_ACCENT[s] + '22',
                    borderColor: STATUS_ACCENT[s],
                  },
                ]}
              >
                <View style={[styles.statusDot, { backgroundColor: STATUS_ACCENT[s] }]} />
                <Text style={[
                  styles.statusChipText,
                  selectedStatus === s && { color: STATUS_ACCENT[s], fontWeight: '700' },
                ]}>
                  {STATUS_LABELS[s]}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* ── Progress section ─────────────────────────────────────────────── */}
        <View style={[styles.card, styles.progressCard]}>
          {/* Ring */}
          <ProgressRing
            progress={progress}
            size={140}
            strokeWidth={12}
            color={Colors.majorelleBlue}
          >
            <Text style={styles.progressCenterText}>{Math.round(progress * 100)}%</Text>
            <Text style={styles.progressSubText}>{MOCK_BOOK.currentPage} / {MOCK_BOOK.totalPages}</Text>
          </ProgressRing>

          {/* Page input */}
          <View style={styles.pageInputGroup}>
            <Text style={styles.cardLabel}>Page actuelle</Text>
            <View style={styles.pageInputRow}>
              <TextInput
                style={styles.pageInput}
                value={pageInput}
                onChangeText={setPageInput}
                keyboardType="number-pad"
                maxLength={4}
                accessibilityLabel="Page actuelle"
              />
              <Text style={styles.pageTotal}> / {MOCK_BOOK.totalPages}</Text>
            </View>
            <Pressable style={styles.updateBtn}>
              <Text style={styles.updateBtnText}>Mettre à jour</Text>
            </Pressable>
          </View>
        </View>

        {/* ── Timer session ────────────────────────────────────────────────── */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Session de lecture</Text>

          {/* Big timer display */}
          <Text style={styles.timerDisplay}>{formatTime(elapsedSecs)}</Text>

          {/* Counters row */}
          <View style={styles.countersRow}>
            <View style={styles.counterItem}>
              <Text style={[styles.counterValue, { color: Colors.majorelleBlue }]}>
                {MOCK_BOOK.currentPage}
              </Text>
              <Text style={styles.counterLabel}>pages lues</Text>
            </View>
            <View style={styles.counterDivider} />
            <View style={styles.counterItem}>
              <Text style={[styles.counterValue, { color: Colors.terracotta }]}>
                {Math.floor(elapsedSecs / 60)}
              </Text>
              <Text style={styles.counterLabel}>minutes</Text>
            </View>
          </View>

          {/* Timer controls */}
          <View style={styles.timerControls}>
            {timerState === 'idle' && (
              <Pressable
                style={[styles.timerBtn, styles.timerBtnPrimary]}
                onPress={() => setTimerState('running')}
              >
                <Text style={styles.timerBtnText}>▶  Démarrer</Text>
              </Pressable>
            )}

            {timerState === 'running' && (
              <>
                <Pressable
                  style={[styles.timerBtn, styles.timerBtnSecondary]}
                  onPress={() => setTimerState('paused')}
                >
                  <Text style={[styles.timerBtnText, { color: Colors.secondary }]}>⏸  Pause</Text>
                </Pressable>
                <Pressable
                  style={[styles.timerBtn, styles.timerBtnStop]}
                  onPress={() => setTimerState('idle')}
                >
                  <Text style={[styles.timerBtnText, { color: Colors.onSurface }]}>■  Arrêter</Text>
                </Pressable>
              </>
            )}

            {timerState === 'paused' && (
              <>
                <Pressable
                  style={[styles.timerBtn, styles.timerBtnPrimary]}
                  onPress={() => setTimerState('running')}
                >
                  <Text style={styles.timerBtnText}>▶  Reprendre</Text>
                </Pressable>
                <Pressable
                  style={[styles.timerBtn, styles.timerBtnStop]}
                  onPress={() => setTimerState('idle')}
                >
                  <Text style={[styles.timerBtnText, { color: Colors.onSurface }]}>■  Arrêter</Text>
                </Pressable>
              </>
            )}
          </View>

          {/* Status indicator */}
          {timerState !== 'idle' && (
            <View style={styles.timerStatusRow}>
              <View style={[
                styles.timerDot,
                { backgroundColor: timerState === 'running' ? Colors.mintGreen : Colors.terracotta },
              ]} />
              <Text style={styles.timerStatusText}>
                {timerState === 'running' ? 'Session en cours...' : 'Session en pause'}
              </Text>
            </View>
          )}
        </View>

        {/* ── Book info ────────────────────────────────────────────────────── */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Informations</Text>
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Text style={styles.infoValue}>{MOCK_BOOK.totalPages}</Text>
              <Text style={styles.infoLabel}>Pages totales</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoValue}>
                {MOCK_BOOK.language === 'fr' ? 'Français' : MOCK_BOOK.language === 'ar' ? 'العربية' : 'Tamazight'}
              </Text>
              <Text style={styles.infoLabel}>Langue</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoValue}>{MOCK_BOOK.rating} ★</Text>
              <Text style={styles.infoLabel}>Note</Text>
            </View>
          </View>
        </View>

        {/* ── Delete book ──────────────────────────────────────────────────── */}
        <Pressable style={styles.deleteBtn} accessibilityRole="button">
          <Text style={styles.deleteBtnText}>Supprimer le livre</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  // ── Hero ───────────────────────────────────────────────────────────────────
  hero: {
    paddingTop: Platform.OS === 'android' ? 40 : 16,
    paddingBottom: Spacing.xl,
    alignItems: 'center',
    gap: Spacing.xs,
    position: 'relative',
    overflow: 'hidden',
  },
  zelligeOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 2,
  },
  zelligeTile: {
    width: 60,
    height: 60,
    borderWidth: 6,
    borderColor: '#fff',
    borderRadius: 4,
    transform: [{ rotate: '15deg' }],
  },
  backBtn: {
    position: 'absolute',
    top: Platform.OS === 'android' ? 44 : 16,
    left: Spacing.gutter,
    width: 36,
    height: 36,
    borderRadius: Radii.full,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 22,
    color: '#fff',
    fontWeight: '700',
    lineHeight: 24,
    marginTop: -2,
  },
  coverCircle: {
    width: 80,
    height: 80,
    borderRadius: Radii.full,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.md,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  coverLetter: {
    fontSize: 36,
    fontWeight: '700',
    color: '#fff',
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    paddingHorizontal: Spacing.lg,
    letterSpacing: -0.5,
    marginTop: Spacing.sm,
  },
  heroAuthor: {
    fontSize: 14,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.8)',
  },
  starsRow: {
    flexDirection: 'row',
    gap: 4,
    marginTop: Spacing.xs,
  },
  star: {
    fontSize: 22,
    color: 'rgba(255,255,255,0.35)',
  },
  starFilled: {
    color: '#FFD700',
  },

  // ── Scroll content ─────────────────────────────────────────────────────────
  scroll: { flex: 1 },
  scrollContent: {
    gap: Spacing.md,
    padding: Spacing.gutter,
    paddingBottom: Spacing.xl * 2,
  },

  // ── Card ───────────────────────────────────────────────────────────────────
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.lg,
    gap: Spacing.md,
    ...Shadows.card,
  },
  cardLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.outline,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },

  // ── Status ─────────────────────────────────────────────────────────────────
  statusRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    flexWrap: 'wrap',
  },
  statusChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    borderRadius: Radii.full,
    borderWidth: 1.5,
    borderColor: Colors.outlineVariant,
    backgroundColor: Colors.surface,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusChipText: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.onSurfaceVariant,
  },

  // ── Progress card ──────────────────────────────────────────────────────────
  progressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
  },
  progressCenterText: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.onSurface,
  },
  progressSubText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.outline,
    marginTop: 4,
  },
  pageInputGroup: {
    flex: 1,
    gap: Spacing.sm,
  },
  pageInputRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  pageInput: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.majorelleBlue,
    letterSpacing: -1,
    padding: 0,
    minWidth: 60,
    borderBottomWidth: 2,
    borderBottomColor: Colors.majorelleBlue,
  },
  pageTotal: {
    fontSize: 16,
    color: Colors.outline,
    fontWeight: '400',
  },
  updateBtn: {
    backgroundColor: Colors.primaryContainer,
    borderRadius: Radii.full,
    paddingVertical: Spacing.xs + 2,
    paddingHorizontal: Spacing.md,
    alignSelf: 'flex-start',
  },
  updateBtnText: {
    color: Colors.onPrimary,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.2,
  },

  // ── Timer ──────────────────────────────────────────────────────────────────
  timerDisplay: {
    fontSize: 48,
    fontWeight: '700',
    color: Colors.onSurface,
    textAlign: 'center',
    letterSpacing: -1,
    fontVariant: ['tabular-nums'],
  },
  countersRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.lg,
  },
  counterItem: {
    alignItems: 'center',
    gap: 2,
  },
  counterValue: {
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  counterLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: Colors.outline,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  counterDivider: {
    width: 1,
    height: 32,
    backgroundColor: Colors.outlineVariant,
  },
  timerControls: {
    flexDirection: 'row',
    gap: Spacing.sm,
    justifyContent: 'center',
  },
  timerBtn: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: Radii.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerBtnPrimary: {
    backgroundColor: Colors.primaryContainer,
    ...Shadows.active,
  },
  timerBtnSecondary: {
    backgroundColor: Colors.secondaryContainer + '22',
    borderWidth: 1.5,
    borderColor: Colors.secondaryContainer,
  },
  timerBtnStop: {
    backgroundColor: Colors.surfaceContainerHigh,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  timerBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.onPrimary,
    letterSpacing: 0.3,
  },
  timerStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
  },
  timerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  timerStatusText: {
    fontSize: 12,
    color: Colors.onSurfaceVariant,
    fontWeight: '500',
  },

  // ── Info grid ──────────────────────────────────────────────────────────────
  infoGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  infoItem: {
    alignItems: 'center',
    gap: 4,
  },
  infoValue: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.onSurface,
    letterSpacing: -0.3,
  },
  infoLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: Colors.outline,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // ── Delete ─────────────────────────────────────────────────────────────────
  deleteBtn: {
    alignSelf: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: Radii.full,
    borderWidth: 1.5,
    borderColor: Colors.error + '55',
    marginTop: Spacing.sm,
  },
  deleteBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.error,
  },
});
