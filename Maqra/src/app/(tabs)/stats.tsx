import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { colors, typography } from '../../theme/colors';
import { ZelligeBackground } from '../../components/ZelligeBackground';
import { useBookStore } from '../../store/useBookStore';
import { calculateReadingStreak, calculateTotalPagesRead, calculateTotalReadingTime, formatDuration } from '../../lib/stats';

export default function StatsScreen() {
  const { userProfile, sessions, books, updateUserProfile } = useBookStore();

  const streak = calculateReadingStreak(sessions);
  const totalHours = formatDuration(calculateTotalReadingTime(sessions));
  
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      updateUserProfile({ avatarUri: result.assets[0].uri });
    }
  };

  const editName = () => {
    Alert.prompt(
      "Modifier le profil",
      "Entrez votre nom",
      [
        { text: "Annuler", style: "cancel" },
        { text: "Enregistrer", onPress: (name: string | undefined) => name && updateUserProfile({ name }) }
      ],
      "plain-text",
      userProfile.name
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ZelligeBackground opacity={0.6} />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Statistiques & Profil</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.profileSection}>
          <TouchableOpacity style={styles.avatarContainer} onPress={pickImage}>
            <Image 
              source={{ uri: userProfile.avatarUri || 'https://ui-avatars.com/api/?name=' + userProfile.name + '&background=random' }} 
              style={styles.avatar} 
            />
            <View style={styles.badge}>
              <MaterialIcons name="camera-alt" size={16} color={colors.white} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={editName} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
             <Text style={styles.userName}>{userProfile.name}</Text>
             <MaterialIcons name="edit" size={16} color={colors.outline} />
          </TouchableOpacity>
          <Text style={styles.userTitle}>Lecteur Passionné</Text>
        </View>

        <View style={styles.statsCard}>
          <View style={styles.statRow}>
            <MaterialIcons name="local-fire-department" size={24} color={colors.secondary} />
            <View style={styles.statTextContainer}>
              <Text style={styles.statValue}>{streak} Jours</Text>
              <Text style={styles.statDesc}>Série de lecture actuelle</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.statRow}>
            <MaterialIcons name="menu-book" size={24} color={colors.primary} />
            <View style={styles.statTextContainer}>
              <Text style={styles.statValue}>{totalHours}</Text>
              <Text style={styles.statDesc}>Temps total de lecture</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.statRow}>
            <MaterialIcons name="emoji-events" size={24} color={colors.gold} />
            <View style={styles.statTextContainer}>
              <Text style={styles.statValue}>{books.filter(b => b.status === 'completed').length}</Text>
              <Text style={styles.statDesc}>Livres terminés</Text>
            </View>
          </View>
        </View>

        <View style={styles.historyHeader}>
          <Text style={styles.historyTitle}>Dernières sessions</Text>
        </View>
        
        {sessions.slice().reverse().slice(0, 5).map((session) => {
          const book = books.find(b => b.id === session.bookId);
          return (
            <View key={session.id} style={styles.historyCard}>
              <View>
                <Text style={styles.historyBookTitle}>{book?.title || 'Livre supprimé'}</Text>
                <Text style={styles.historyDate}>{new Date(session.startedAt).toLocaleDateString()}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                 <Text style={styles.historyPages}>+{session.pagesRead} pages</Text>
                 <Text style={styles.historyDuration}>{formatDuration(session.duration)}</Text>
              </View>
            </View>
          )
        })}
        {sessions.length === 0 && (
          <Text style={styles.emptyText}>Aucune session enregistrée.</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },
  header: {
    paddingHorizontal: 20, height: 64, justifyContent: 'center', alignItems: 'center',
    backgroundColor: 'rgba(253, 249, 243, 0.9)', borderBottomWidth: 1, borderBottomColor: 'rgba(120, 117, 134, 0.1)',
  },
  headerTitle: { ...typography.headlineMd, color: colors.primary },
  content: { padding: 20, gap: 24, paddingBottom: 100 },
  profileSection: { alignItems: 'center', gap: 8, marginTop: 16 },
  avatarContainer: {
    width: 120, height: 120, borderRadius: 60, borderWidth: 4, borderColor: colors.white,
    elevation: 8, shadowColor: colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 12, marginBottom: 8,
  },
  avatar: { width: '100%', height: '100%', borderRadius: 60 },
  badge: {
    position: 'absolute', bottom: 0, right: 0, backgroundColor: colors.tertiary, width: 32, height: 32, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: colors.white,
  },
  userName: { ...typography.headlineMd, color: colors.onSurface },
  userTitle: { ...typography.bodyMd, color: colors.secondary },
  statsCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: 24, padding: 24, elevation: 2, shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, borderColor: 'rgba(120, 117, 134, 0.1)', borderWidth: 1,
  },
  statRow: { flexDirection: 'row', alignItems: 'center', gap: 16, paddingVertical: 12 },
  statTextContainer: { flex: 1 },
  statValue: { ...typography.headlineSm, color: colors.onSurface },
  statDesc: { ...typography.bodyMd, color: colors.onSurfaceVariant },
  divider: { height: 1, backgroundColor: 'rgba(120, 117, 134, 0.1)', marginVertical: 4 },
  historyHeader: { marginTop: 16 },
  historyTitle: { ...typography.headlineSm, color: colors.onSurface },
  historyCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)', padding: 16, borderRadius: 16, flexDirection: 'row',
    justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: colors.outlineVariant
  },
  historyBookTitle: { ...typography.labelMd, color: colors.onSurface },
  historyDate: { ...typography.bodyMd, color: colors.outline, marginTop: 4 },
  historyPages: { ...typography.labelMd, color: colors.secondary },
  historyDuration: { ...typography.bodyMd, color: colors.outline, marginTop: 4 },
  emptyText: { textAlign: 'center', color: colors.outline, ...typography.bodyMd },
});
