import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BookCard } from '../../components/BookCard';
import { ProgressRing } from '../../components/ProgressRing';
import { SmallBookCard } from '../../components/SmallBookCard';
import { ZelligeBackground } from '../../components/ZelligeBackground';
import { calculateTotalPagesRead } from '../../lib/stats';
import { useBookStore } from '../../store/useBookStore';
import { colors, typography } from '../../theme/colors';
import { Book, Language, ReadStatus } from '../../types/book';
import { getCoverForBook } from '../../utils/covers';



type FilterType = 'all' | Language;

export default function LibraryScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const ringSize = Math.min(width * 0.45, 176);

  const { books, userProfile, sessions } = useBookStore();
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const displayBooks = books;

  const booksRead = displayBooks.filter((b) => b.status === 'completed').length;
  const progress = userProfile.annualGoal > 0 ? booksRead / userProfile.annualGoal : 0;

  const totalPagesRead = calculateTotalPagesRead(sessions);
  const booksCompletedThisMonth = sessions.filter(s => {
    const d = new Date(s.startedAt);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length; // Note: this is a simple approximation. Better to check book completion dates.

  const filteredBooks = useMemo(() => {
    if (activeFilter === 'all') return displayBooks;
    return displayBooks.filter((b) => b.language === activeFilter);
  }, [displayBooks, activeFilter]);

  const mapStatus = (status: ReadStatus): 'En Cours' | 'À Lire' | 'Terminé' => {
    switch (status) {
      case 'reading': return 'En Cours';
      case 'to_read': return 'À Lire';
      case 'completed': return 'Terminé';
    }
  };

  const mapLanguage = (lang: Language) => {
    switch (lang) {
      case 'fr': return 'FRANÇAIS';
      case 'ar': return 'العربية';
      case 'amz': return 'TAMAZIGHT';
      case 'en': return 'ENGLISH';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ZelligeBackground opacity={0.6} />

      {/* TopAppBar */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.iconButton}>
            <MaterialIcons name="menu" size={24} color={colors.primary} />
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <Text style={[typography.arabic, styles.titleArabic]}>مقرأ</Text>
            <Text style={[typography.displayLg, styles.titleLatin]}>Maqra</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.profileImageContainer} onPress={() => router.push('/stats')}>
          <Image
            source={{ uri: userProfile.avatarUri || 'https://ui-avatars.com/api/?name=User&background=random' }}
            style={styles.profileImage}
          />
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredBooks}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            {/* Annual Goal */}
            <View style={styles.goalCard}>
              <View style={styles.goalContent}>
                <ProgressRing progress={progress} size={ringSize} strokeWidth={6}>
                  <Text style={[styles.goalNumber, { fontSize: ringSize * 0.2 }]}>{booksRead}/{userProfile.annualGoal}</Text>
                  <Text style={[styles.goalLabel, { fontSize: ringSize * 0.06 }]}>LIVRES LUS</Text>
                </ProgressRing>

                <View style={styles.goalTextContainer}>
                  <View style={styles.goalHeaderRow}>
                    <MaterialIcons name="auto-stories" size={20} color={colors.secondary} />
                    <Text style={styles.goalTitle}>Objectif Annuel</Text>
                  </View>
                  <Text style={styles.goalSubtitle}>
                    Progression de <Text style={{ color: colors.primary, fontWeight: 'bold' }}>{Math.round(progress * 100)}%</Text>
                  </Text>
                </View>
              </View>
            </View>

            {/* Stats Grid */}
            <View style={styles.statsGrid}>
              <View style={[styles.statBox, { borderBottomColor: 'rgba(159, 64, 45, 0.3)' }]}>
                <Text style={[typography.headlineMd, { color: colors.primary }]}>{displayBooks.length}</Text>
                <Text style={styles.statLabel}>LIVRES</Text>
              </View>
              <View style={[styles.statBox, { borderBottomColor: 'rgba(0, 90, 64, 0.3)' }]}>
                <Text style={[typography.headlineMd, { color: colors.primary }]}>{totalPagesRead}</Text>
                <Text style={styles.statLabel}>PAGES</Text>
              </View>
              <View style={[styles.statBox, { borderBottomColor: 'rgba(212, 175, 55, 0.3)' }]}>
                <Text style={[typography.headlineMd, { color: colors.secondary }]}>{booksCompletedThisMonth}</Text>
                <Text style={styles.statLabel}>CE MOIS</Text>
              </View>
            </View>

            {/* Filters */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersContainer} contentContainerStyle={styles.filtersContent}>
              <TouchableOpacity style={[styles.filterChip, activeFilter === 'all' && styles.filterChipActive]} onPress={() => setActiveFilter('all')}>
                <Text style={[styles.filterChipText, activeFilter === 'all' && styles.filterChipTextActive]}>Tous</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.filterChip, activeFilter === 'ar' && styles.filterChipActive]} onPress={() => setActiveFilter('ar')}>
                <Text style={[styles.filterChipText, activeFilter === 'ar' && styles.filterChipTextActive]}>العربية</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.filterChip, activeFilter === 'fr' && styles.filterChipActive]} onPress={() => setActiveFilter('fr')}>
                <Text style={[styles.filterChipText, activeFilter === 'fr' && styles.filterChipTextActive]}>Français</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.filterChip, activeFilter === 'en' && styles.filterChipActive]} onPress={() => setActiveFilter('en')}>
                <Text style={[styles.filterChipText, activeFilter === 'en' && styles.filterChipTextActive]}>English</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.filterChip, activeFilter === 'amz' && styles.filterChipActive]} onPress={() => setActiveFilter('amz')}>
                <Text style={[styles.filterChipText, activeFilter === 'amz' && styles.filterChipTextActive]}>Tamazight</Text>
              </TouchableOpacity>
            </ScrollView>

            <View style={styles.listHeader}>
              <View>
                <Text style={styles.listTitle}>Ma Collection</Text>
                <View style={styles.listTitleUnderline} />
              </View>
            </View>
          </>
        }
        renderItem={({ item }) => (
          <View style={{ marginBottom: 16 }}>
            <BookCard
              title={item.title}
              author={item.author}
              coverUrl={getCoverForBook(item)}
              status={mapStatus(item.status)}
              progress={item.totalPages > 0 ? item.currentPage / item.totalPages : 0}
              language={mapLanguage(item.language)}
            />
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Votre bibliothèque est vide.</Text>
            <Text style={styles.emptySubtext}>Ajoutez votre premier livre !</Text>
          </View>
        }

      />

      {/* FAB */}
      <TouchableOpacity style={styles.fab} onPress={() => router.push('/add-book')}>
        <MaterialIcons name="add" size={32} color={colors.white} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    height: 64,
    backgroundColor: 'rgba(253, 249, 243, 0.9)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(120, 117, 134, 0.1)',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconButton: {
    padding: 8,
    borderRadius: 20,
  },
  titleContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    marginTop: -4,
  },
  titleArabic: {
    fontSize: 20,
    color: colors.secondary,
    lineHeight: 20,
  },
  titleLatin: {
    fontSize: 20,
    color: colors.primary,
    lineHeight: 20,
    marginTop: -4,
  },
  profileImageContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'rgba(71, 52, 195, 0.2)',
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 120, // space for tab bar and FAB
    gap: 32,
  },
  goalCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 24,
    padding: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    borderColor: 'rgba(120, 117, 134, 0.1)',
    borderWidth: 1,
  },
  goalContent: {
    alignItems: 'center',
    gap: 16,
  },
  goalNumber: {
    ...typography.displayLg,
    fontSize: 36,
    color: colors.primary,
  },
  goalLabel: {
    ...typography.labelSm,
    color: colors.outline,
    letterSpacing: 2,
    fontSize: 10,
    marginTop: 4,
  },
  goalTextContainer: {
    alignItems: 'center',
    gap: 8,
  },
  goalHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  goalTitle: {
    ...typography.headlineSm,
    color: colors.onSurface,
  },
  goalSubtitle: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  statBox: {
    flex: 1,
    backgroundColor: 'rgba(247, 243, 237, 0.95)',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 8,
    alignItems: 'center',
    borderBottomWidth: 4,
  },
  statLabel: {
    ...typography.labelSm,
    color: colors.onSurfaceVariant,
    fontSize: 10,
    letterSpacing: 1,
    marginTop: 4,
  },
  filtersContainer: {
    marginHorizontal: -20,
    marginBottom: 8,
  },
  filtersContent: {
    paddingHorizontal: 20,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(120, 117, 134, 0.1)',
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    elevation: 2,
  },
  filterChipText: {
    ...typography.labelMd,
    color: colors.onSurfaceVariant,
  },
  filterChipTextActive: {
    color: colors.white,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  listTitle: {
    ...typography.headlineMd,
    color: colors.onSurface,
  },
  listTitleUnderline: {
    height: 4,
    width: 48,
    backgroundColor: colors.secondary,
    borderRadius: 2,
    marginTop: 4,
  },
  fab: {
    position: 'absolute',
    bottom: 100, // Above tab bar
    right: 20,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    borderWidth: 4,
    borderColor: colors.white,
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    ...typography.headlineSm,
    color: colors.onSurfaceVariant,
  },
  emptySubtext: {
    ...typography.bodyMd,
    color: colors.outline,
    marginTop: 8,
  },
  booksSection: {
    marginTop: 32,
    marginBottom: 16,
  },
  horizontalBooksList: {
    paddingRight: 20,
    paddingBottom: 8,
  },
});
