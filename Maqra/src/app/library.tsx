/**
 * Library Dashboard — Screen 1 (UI only, no business logic)
 *
 * Displays:
 *  - Header with app name & avatar
 *  - Annual goal progress ring
 *  - Quick stat cards (books, pages, completed this month)
 *  - Search bar
 *  - Filter chips (status + language)
 *  - FlatList of book cards
 *  - Floating Add button (FAB)
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Pressable,
  StatusBar,
  Platform,
} from 'react-native';
import { Colors, Radii, Shadows, Spacing } from '@/constants/colors';
import { Book, Language, ReadStatus } from '@/types/book';
import BookCard from '@/components/BookCard';
import ProgressRing from '@/components/ProgressRing';
import StatCard from '@/components/StatCard';
import SearchBar from '@/components/SearchBar';
import FilterBar from '@/components/FilterBar';

// ─────────────────────────────────────────────────────────────────────────────
// Mock data — replaced by store in Day 2
// ─────────────────────────────────────────────────────────────────────────────
const MOCK_BOOKS: Book[] = [
  {
    id: '1',
    title: 'البحث عن زمن مفقود',
    author: 'مارسيل بروست',
    coverColor: '#4734C3',
    language: 'ar',
    status: 'reading',
    totalPages: 480,
    currentPage: 212,
    rating: 4,
    addedAt: '2026-01-10',
  },
  {
    id: '2',
    title: 'Le Passé Simple',
    author: 'Driss Chraïbi',
    coverColor: '#9F402D',
    language: 'fr',
    status: 'completed',
    totalPages: 256,
    currentPage: 256,
    rating: 5,
    addedAt: '2026-02-03',
  },
  {
    id: '3',
    title: 'Tifinagh — Poésie Amazighe',
    author: 'Fatima Tabaamrant',
    coverColor: '#005A40',
    language: 'amz',
    status: 'to_read',
    totalPages: 184,
    currentPage: 0,
    addedAt: '2026-03-15',
  },
  {
    id: '4',
    title: 'La Boîte à Merveilles',
    author: 'Ahmed Sefrioui',
    coverColor: '#5847D3',
    language: 'fr',
    status: 'reading',
    totalPages: 160,
    currentPage: 88,
    rating: 4,
    addedAt: '2026-04-01',
  },
  {
    id: '5',
    title: 'مدن الملح',
    author: 'عبد الرحمن منيف',
    coverColor: '#C44B25',
    language: 'ar',
    status: 'to_read',
    totalPages: 622,
    currentPage: 0,
    addedAt: '2026-04-20',
  },
  {
    id: '6',
    title: 'Le Lion',
    author: 'Joseph Kessel',
    coverColor: '#006E51',
    language: 'fr',
    status: 'completed',
    totalPages: 224,
    currentPage: 224,
    rating: 5,
    addedAt: '2026-05-02',
  },
];

const ANNUAL_GOAL = 20;
const BOOKS_READ  = 14;

// ─────────────────────────────────────────────────────────────────────────────
export default function LibraryScreen() {
  const [search,         setSearch]         = useState('');
  const [activeStatus,   setActiveStatus]   = useState<ReadStatus | 'all'>('all');
  const [activeLanguage, setActiveLanguage] = useState<Language | 'all'>('all');

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      <FlatList
        data={MOCK_BOOKS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}

        // ── Header ────────────────────────────────────────────────────────────
        ListHeaderComponent={
          <View style={styles.header}>

            {/* ── Top row: brand + avatar ──────────────────────────────────── */}
            <View style={styles.topRow}>
              <View>
                <Text style={styles.appName}>مقراء</Text>
                <Text style={styles.appNameLatin}>Maqra</Text>
              </View>
              <View style={styles.avatar}>
                <Text style={styles.avatarInitial}>S</Text>
              </View>
            </View>

            {/* ── Annual goal + quick stats ────────────────────────────────── */}
            <View style={styles.goalSection}>
              {/* Progress ring */}
              <View style={styles.goalCard}>
                <ProgressRing
                  progress={BOOKS_READ / ANNUAL_GOAL}
                  size={130}
                  strokeWidth={10}
                  centerLabel={`${BOOKS_READ}/${ANNUAL_GOAL}`}
                  subLabel="livres lus"
                  color={Colors.majorelleBlue}
                />
                <Text style={styles.goalLabel}>Objectif annuel</Text>
              </View>

              {/* Stat tiles — 2×2 grid */}
              <View style={styles.statsGrid}>
                <View style={styles.statsRow}>
                  <StatCard
                    value="34"
                    label="Livres"
                    accent={Colors.majorelleBlue}
                  />
                  <StatCard
                    value="8 420"
                    label="Pages"
                    accent={Colors.terracotta}
                  />
                </View>
                <View style={styles.statsRow}>
                  <StatCard
                    value="3"
                    label="Ce mois"
                    accent={Colors.mintGreen}
                  />
                  <StatCard
                    value="14"
                    label="Terminés"
                    accent={Colors.majorelleBlue}
                  />
                </View>
              </View>
            </View>

            {/* ── Zellige decorative rule ──────────────────────────────────── */}
            <View style={styles.divider}>
              {[...Array(8)].map((_, i) => (
                <View
                  key={i}
                  style={[
                    styles.dividerTile,
                    { backgroundColor: i % 2 === 0 ? Colors.majorelleBlue + '22' : Colors.terracotta + '22' },
                  ]}
                />
              ))}
            </View>

            {/* ── Search bar ──────────────────────────────────────────────── */}
            <View style={styles.section}>
              <SearchBar
                value={search}
                onChangeText={setSearch}
                placeholder="Rechercher par titre ou auteur..."
              />
            </View>

            {/* ── Filter chips ─────────────────────────────────────────────── */}
            <View style={styles.section}>
              <FilterBar
                activeStatus={activeStatus}
                activeLanguage={activeLanguage}
                onStatusChange={setActiveStatus}
                onLanguageChange={setActiveLanguage}
              />
            </View>

            {/* ── Section title ─────────────────────────────────────────────── */}
            <View style={styles.sectionTitleRow}>
              <Text style={styles.sectionTitle}>Ma bibliothèque</Text>
              <Text style={styles.bookCount}>{MOCK_BOOKS.length} livres</Text>
            </View>
          </View>
        }

        // ── Book cards ────────────────────────────────────────────────────────
        renderItem={({ item }) => (
          <View style={styles.cardWrap}>
            <BookCard book={item} onPress={() => {}} />
          </View>
        )}
        ItemSeparatorComponent={() => <View style={{ height: Spacing.md }} />}

        // ── Empty state ───────────────────────────────────────────────────────
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📚</Text>
            <Text style={styles.emptyText}>
              Votre bibliothèque est vide.{'\n'}Ajoutez votre premier livre !
            </Text>
          </View>
        }
      />

      {/* ── Floating Add Button (FAB) ─────────────────────────────────────── */}
      <Pressable
        style={({ pressed }) => [styles.fab, pressed && styles.fabPressed]}
        accessibilityLabel="Ajouter un livre"
        accessibilityRole="button"
      >
        <Text style={styles.fabIcon}>+</Text>
        <Text style={styles.fabLabel}>Ajouter</Text>
      </Pressable>
    </SafeAreaView>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  listContent: {
    paddingBottom: 120, // space for FAB
  },

  // ── Header ─────────────────────────────────────────────────────────────────
  header: {
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight ?? 0) + 8 : 8,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.gutter,
    paddingBottom: Spacing.lg,
  },
  appName: {
    fontSize: 26,
    fontWeight: '700',
    color: Colors.majorelleBlue,
    lineHeight: 30,
    letterSpacing: -0.5,
  },
  appNameLatin: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.outline,
    letterSpacing: 3,
    textTransform: 'uppercase',
    marginTop: 2,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: Radii.full,
    backgroundColor: Colors.majorelleBlue,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.card,
  },
  avatarInitial: {
    color: Colors.onPrimary,
    fontSize: 18,
    fontWeight: '700',
  },

  // ── Goal section ───────────────────────────────────────────────────────────
  goalSection: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.gutter,
    gap: Spacing.md,
    marginBottom: Spacing.lg,
    alignItems: 'center',
  },
  goalCard: {
    alignItems: 'center',
    gap: Spacing.xs,
  },
  goalLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.onSurfaceVariant,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  statsGrid: {
    flex: 1,
    gap: Spacing.sm,
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },

  // ── Zellige divider ────────────────────────────────────────────────────────
  divider: {
    flexDirection: 'row',
    height: 6,
    marginBottom: Spacing.lg,
    overflow: 'hidden',
  },
  dividerTile: {
    flex: 1,
  },

  // ── Search / filter sections ───────────────────────────────────────────────
  section: {
    paddingHorizontal: Spacing.gutter,
    marginBottom: Spacing.md,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.gutter,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.onSurface,
    letterSpacing: -0.3,
  },
  bookCount: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.outline,
  },

  // ── Card list ──────────────────────────────────────────────────────────────
  cardWrap: {
    paddingHorizontal: Spacing.gutter,
  },

  // ── Empty state ────────────────────────────────────────────────────────────
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.xl * 2,
    gap: Spacing.md,
  },
  emptyIcon: {
    fontSize: 48,
  },
  emptyText: {
    fontSize: 15,
    color: Colors.outline,
    textAlign: 'center',
    lineHeight: 22,
  },

  // ── FAB ────────────────────────────────────────────────────────────────────
  fab: {
    position: 'absolute',
    bottom: Spacing.xl,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.primaryContainer,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: Radii.full, // pill shape per DESIGN.md
    ...Shadows.active,
  },
  fabPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.97 }],
  },
  fabIcon: {
    color: Colors.onPrimary,
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 24,
  },
  fabLabel: {
    color: Colors.onPrimary,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
