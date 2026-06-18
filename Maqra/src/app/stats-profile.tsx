/**
 * Stats & Profile — Screen 3 (UI only, no business logic)
 *
 * Displays:
 *  - Profile card (photo, name, streak counter)
 *  - Lifetime stat blocks (books, pages, time, streak)
 *  - Month-by-month bar chart (animated appearance, no library)
 *  - Reading session history (FlatList of SessionCards)
 *  - Delete session / book controls
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  FlatList,
  Pressable,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';
import { Colors, Radii, Shadows, Spacing } from '@/constants/colors';
import StatCard from '@/components/StatCard';
import SessionCard from '@/components/SessionCard';
import type { ReadingSession } from '@/types/book';

// ── Mock data (replaced by store in Day 4) ─────────────────────────────────────
const MOCK_SESSIONS: (ReadingSession & { bookTitle: string })[] = [
  { id: 's1', bookId: '1', startedAt: '2026-06-15T10:30:00Z', duration: 3600, pagesRead: 48, bookTitle: 'Le Passé Simple' },
  { id: 's2', bookId: '2', startedAt: '2026-06-14T20:00:00Z', duration: 5400, pagesRead: 72, bookTitle: 'مدن الملح' },
  { id: 's3', bookId: '1', startedAt: '2026-06-13T09:00:00Z', duration: 2700, pagesRead: 35, bookTitle: 'Le Passé Simple' },
  { id: 's4', bookId: '3', startedAt: '2026-06-10T19:00:00Z', duration: 1800, pagesRead: 22, bookTitle: 'Tifinagh — Poésie Amazighe' },
  { id: 's5', bookId: '2', startedAt: '2026-06-08T11:00:00Z', duration: 4200, pagesRead: 55, bookTitle: 'مدن الملح' },
];

// Books completed per month Jan–Jun
const MONTHLY_DATA = [
  { month: 'Jan', count: 2 },
  { month: 'Fév', count: 1 },
  { month: 'Mar', count: 3 },
  { month: 'Avr', count: 2 },
  { month: 'Mai', count: 4 },
  { month: 'Jun', count: 3 },
];

const MAX_COUNT = Math.max(...MONTHLY_DATA.map((d) => d.count));

export default function StatsProfileScreen() {
  const [activeTab, setActiveTab] = useState<'stats' | 'history'>('stats');

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <View style={styles.topRow}>
        <Text style={styles.screenTitle}>Profil & Statistiques</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── Profile card ─────────────────────────────────────────────────── */}
        <View style={styles.profileCard}>
          {/* Avatar area */}
          <Pressable style={styles.avatarWrap} accessibilityLabel="Prendre une photo de profil">
            <View style={styles.avatarBg}>
              <Text style={styles.avatarInitial}>S</Text>
            </View>
            {/* Camera badge */}
            <View style={styles.cameraBadge}>
              <Text style={styles.cameraBadgeIcon}>📷</Text>
            </View>
          </Pressable>

          {/* Name + streak */}
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>Sara M.</Text>
            <Text style={styles.profileSub}>Lectrice passionnée</Text>

            {/* Streak pill */}
            <View style={styles.streakPill}>
              <Text style={styles.streakFlame}>🔥</Text>
              <Text style={styles.streakCount}>12 jours</Text>
              <Text style={styles.streakLabel}>de lecture</Text>
            </View>
          </View>

          {/* Zellige corner accent */}
          <View style={styles.profileZellige}>
            {[0, 1, 2].map((i) => (
              <View
                key={i}
                style={[
                  styles.profileZelligeTile,
                  {
                    backgroundColor: Colors.majorelleBlue + (i === 0 ? '15' : i === 1 ? '10' : '08'),
                    transform: [{ rotate: `${i * 15}deg` }],
                  },
                ]}
              />
            ))}
          </View>
        </View>

        {/* ── Stat grid 2×2 ────────────────────────────────────────────────── */}
        <View style={styles.statGrid}>
          <View style={styles.statRow}>
            <StatCard value="34"   label="Total livres" accent={Colors.majorelleBlue} />
            <StatCard value="8420" label="Pages lues"   accent={Colors.terracotta} />
          </View>
          <View style={styles.statRow}>
            <StatCard value="142h" label="Temps lu"     accent={Colors.mintGreen} />
            <StatCard value="14"   label="Terminés"     accent={Colors.majorelleBlue} />
          </View>
        </View>

        {/* ── Tab switcher ─────────────────────────────────────────────────── */}
        <View style={styles.tabBar}>
          {(['stats', 'history'] as const).map((tab) => (
            <Pressable
              key={tab}
              style={[styles.tabBtn, activeTab === tab && styles.tabBtnActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                {tab === 'stats' ? 'Graphique' : 'Historique'}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* ── Bar chart (stats tab) ─────────────────────────────────────────── */}
        {activeTab === 'stats' && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Livres terminés par mois</Text>

            <View style={styles.chart}>
              {MONTHLY_DATA.map((item, index) => {
                const heightPct = item.count / MAX_COUNT;
                return (
                  <View key={item.month} style={styles.chartColumn}>
                    {/* Count label */}
                    <Text style={styles.barCount}>{item.count}</Text>

                    {/* Bar */}
                    <View style={styles.barTrack}>
                      <View
                        style={[
                          styles.barFill,
                          {
                            height: `${Math.round(heightPct * 100)}%`,
                            backgroundColor:
                              index % 3 === 0 ? Colors.majorelleBlue :
                              index % 3 === 1 ? Colors.terracotta    :
                              Colors.mintGreen,
                          },
                        ]}
                      />
                    </View>

                    {/* Month label */}
                    <Text style={styles.barLabel}>{item.month}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* ── Session history (history tab) ─────────────────────────────────── */}
        {activeTab === 'history' && (
          <View style={styles.historySection}>
            <Text style={styles.cardTitle}>Sessions de lecture</Text>

            {MOCK_SESSIONS.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyIcon}>📖</Text>
                <Text style={styles.emptyText}>
                  Aucune session enregistrée pour le moment.
                </Text>
              </View>
            ) : (
              <View style={styles.sessionList}>
                {MOCK_SESSIONS.map((session) => (
                  <SessionCard
                    key={session.id}
                    session={session}
                    bookTitle={session.bookTitle}
                    onDelete={() => {}}
                  />
                ))}
              </View>
            )}
          </View>
        )}

        {/* ── Language switcher ─────────────────────────────────────────────── */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Langue de l'interface</Text>
          <View style={styles.langRow}>
            {([
              { code: 'fr', label: 'Français' },
              { code: 'ar', label: 'العربية' },
              { code: 'amz', label: 'Tamazight' },
            ] as const).map((lang) => (
              <Pressable key={lang.code} style={styles.langChip}>
                <Text style={styles.langChipText}>{lang.label}</Text>
              </Pressable>
            ))}
          </View>
        </View>
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
  topRow: {
    paddingHorizontal: Spacing.gutter,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight ?? 0) + 8 : 12,
    paddingBottom: Spacing.md,
  },
  screenTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: Colors.onSurface,
    letterSpacing: -0.5,
  },
  scrollContent: {
    gap: Spacing.md,
    padding: Spacing.gutter,
    paddingTop: 0,
    paddingBottom: Spacing.xl * 2,
  },

  // ── Profile card ───────────────────────────────────────────────────────────
  profileCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
    overflow: 'hidden',
    ...Shadows.card,
  },
  avatarWrap: {
    position: 'relative',
  },
  avatarBg: {
    width: 72,
    height: 72,
    borderRadius: Radii.full,
    backgroundColor: Colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.active,
  },
  avatarInitial: {
    fontSize: 30,
    fontWeight: '700',
    color: Colors.onPrimary,
  },
  cameraBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraBadgeIcon: {
    fontSize: 11,
  },
  profileInfo: {
    flex: 1,
    gap: Spacing.xs,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.onSurface,
    letterSpacing: -0.3,
  },
  profileSub: {
    fontSize: 13,
    color: Colors.outline,
    fontWeight: '400',
  },
  streakPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.secondaryContainer + '33',
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: Radii.full,
    marginTop: 4,
  },
  streakFlame: { fontSize: 13 },
  streakCount: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.secondary,
  },
  streakLabel: {
    fontSize: 12,
    color: Colors.secondary,
    fontWeight: '400',
  },
  profileZellige: {
    position: 'absolute',
    top: -16,
    right: -16,
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileZelligeTile: {
    position: 'absolute',
    width: 48,
    height: 48,
    borderRadius: 4,
  },

  // ── Stat grid ──────────────────────────────────────────────────────────────
  statGrid: { gap: Spacing.sm },
  statRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },

  // ── Tab bar ────────────────────────────────────────────────────────────────
  tabBar: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceContainerHigh,
    borderRadius: Radii.lg,
    padding: 4,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: Spacing.sm,
    borderRadius: Radii.md + 4,
    alignItems: 'center',
  },
  tabBtnActive: {
    backgroundColor: Colors.surface,
    ...Shadows.card,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.outline,
  },
  tabTextActive: {
    color: Colors.onSurface,
    fontWeight: '700',
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
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.onSurface,
    letterSpacing: -0.2,
  },

  // ── Bar chart ──────────────────────────────────────────────────────────────
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 140,
    gap: Spacing.sm,
  },
  chartColumn: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
    justifyContent: 'flex-end',
    gap: 4,
  },
  barCount: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.onSurfaceVariant,
  },
  barTrack: {
    flex: 1,
    width: '100%',
    backgroundColor: Colors.surfaceContainerHigh,
    borderRadius: Radii.sm,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    borderRadius: Radii.sm,
    minHeight: 4,
  },
  barLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.outline,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },

  // ── History ────────────────────────────────────────────────────────────────
  historySection: {
    gap: Spacing.md,
  },
  sessionList: {
    gap: Spacing.sm,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    gap: Spacing.sm,
  },
  emptyIcon: { fontSize: 36 },
  emptyText: {
    fontSize: 14,
    color: Colors.outline,
    textAlign: 'center',
    lineHeight: 20,
  },

  // ── Language switcher ──────────────────────────────────────────────────────
  langRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    flexWrap: 'wrap',
  },
  langChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    borderRadius: Radii.full,
    borderWidth: 1.5,
    borderColor: Colors.outlineVariant,
    backgroundColor: Colors.background,
  },
  langChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.onSurfaceVariant,
  },
});
