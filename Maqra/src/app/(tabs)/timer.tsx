import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions, Modal, FlatList, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors, typography } from '../../theme/colors';
import { ZelligeBackground } from '../../components/ZelligeBackground';
import { ProgressRing } from '../../components/ProgressRing';
import { useStopwatch } from '../../hooks/useStopwatch';
import { useBookStore } from '../../store/useBookStore';
import { formatDuration } from '../../lib/stats';
import { Book } from '../../types/book';

export default function TimerScreen() {
  const { width } = useWindowDimensions();
  const ringSize = Math.min(width - 104, 280);
  const router = useRouter();

  const { books, addSession, updateBookProgress } = useBookStore();
  const { elapsedTime, isRunning, start, pause, stop, reset } = useStopwatch();

  const [activeBookId, setActiveBookId] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [pagesReadInput, setPagesReadInput] = useState('');

  const uncompletedBooks = books.filter(b => b.status !== 'completed');
  const activeBook = books.find(b => b.id === activeBookId);

  const handleStop = () => {
    pause(); // pause without resetting
    Alert.prompt(
      "Session terminée",
      "Combien de pages avez-vous lu pendant cette session ?",
      [
        {
          text: "Annuler",
          style: "cancel",
          onPress: () => start(), // resume if cancelled
        },
        {
          text: "Enregistrer",
          onPress: (pages: string | undefined) => {
            const pagesRead = parseInt(pages || '0', 10);
            if (activeBookId) {
              addSession({
                bookId: activeBookId,
                startedAt: new Date(Date.now() - elapsedTime * 1000).toISOString(),
                duration: elapsedTime,
                pagesRead,
              });
              
              if (activeBook) {
                updateBookProgress(activeBookId, activeBook.currentPage + pagesRead);
              }
            }
            reset();
            setActiveBookId(null);
            router.push('/');
          }
        }
      ],
      "plain-text",
      ""
    );
  };

  const handleSelectBook = (book: Book) => {
    setActiveBookId(book.id);
    setIsModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ZelligeBackground opacity={0.6} />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Session de Lecture</Text>
      </View>

      <View style={styles.content}>
        {!activeBookId ? (
          <TouchableOpacity style={styles.selectBookCard} onPress={() => setIsModalVisible(true)}>
            <MaterialIcons name="library-books" size={48} color={colors.primary} />
            <Text style={styles.selectBookTitle}>Sélectionner un livre</Text>
            <Text style={styles.selectBookSubtitle}>Choisissez un livre pour commencer la session</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.timerCard}>
            <Text style={styles.bookTitle}>{activeBook?.title}</Text>
            <Text style={styles.author}>{activeBook?.author}</Text>
            
            <View style={styles.timerContainer}>
              <ProgressRing progress={isRunning ? 1 : 0} size={ringSize} strokeWidth={8} color={colors.secondary}>
                <Text style={styles.timeText}>{formatDuration(elapsedTime)}</Text>
                <Text style={styles.timeLabel}>TEMPS ÉCOULÉ</Text>
              </ProgressRing>
            </View>

            <View style={styles.controlsRow}>
              <TouchableOpacity style={styles.controlButtonOutline} onPress={reset}>
                <MaterialIcons name="replay" size={32} color={colors.outline} />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.playButton} onPress={isRunning ? pause : start}>
                <MaterialIcons name={isRunning ? "pause" : "play-arrow"} size={48} color={colors.white} />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.controlButtonOutline} onPress={handleStop}>
                <MaterialIcons name="stop" size={32} color={colors.outline} />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      <Modal visible={isModalVisible} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setIsModalVisible(false)}>
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Choisir un livre</Text>
            <TouchableOpacity onPress={() => setIsModalVisible(false)}>
              <MaterialIcons name="close" size={24} color={colors.onSurface} />
            </TouchableOpacity>
          </View>
          <FlatList
            data={uncompletedBooks}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.bookListItem} onPress={() => handleSelectBook(item)}>
                <Text style={styles.bookListTitle}>{item.title}</Text>
                <Text style={styles.bookListAuthor}>{item.author}</Text>
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <Text style={styles.emptyText}>Aucun livre en cours. Ajoutez-en un d'abord !</Text>
            }
          />
        </SafeAreaView>
      </Modal>
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
  content: { flex: 1, padding: 20, justifyContent: 'center' },
  timerCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: 32, padding: 24, alignItems: 'center',
    elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12,
    borderWidth: 1, borderColor: 'rgba(120, 117, 134, 0.1)',
  },
  selectBookCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: 32, padding: 32, alignItems: 'center',
    elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12,
    borderWidth: 2, borderColor: colors.primary, borderStyle: 'dashed'
  },
  selectBookTitle: { ...typography.headlineMd, color: colors.primary, marginTop: 16 },
  selectBookSubtitle: { ...typography.bodyMd, color: colors.onSurfaceVariant, textAlign: 'center', marginTop: 8 },
  bookTitle: { ...typography.headlineMd, color: colors.onSurface, textAlign: 'center' },
  author: { ...typography.bodyLg, color: colors.onSurfaceVariant, opacity: 0.8, marginTop: 4 },
  timerContainer: { marginVertical: 40 },
  timeText: { fontFamily: typography.displayLg.fontFamily, fontSize: 56, fontWeight: '700', color: colors.primary },
  timeLabel: { ...typography.labelSm, color: colors.outline, letterSpacing: 2, marginTop: 8, textAlign: 'center' },
  controlsRow: { flexDirection: 'row', alignItems: 'center', gap: 24 },
  controlButtonOutline: {
    width: 64, height: 64, borderRadius: 32, borderWidth: 2, borderColor: 'rgba(120, 117, 134, 0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
  playButton: {
    width: 88, height: 88, borderRadius: 44, backgroundColor: colors.secondary, alignItems: 'center', justifyContent: 'center',
    elevation: 8, shadowColor: colors.secondary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 8,
  },
  modalContainer: { flex: 1, backgroundColor: colors.surface },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, borderBottomWidth: 1, borderColor: colors.outlineVariant },
  modalTitle: { ...typography.headlineMd, color: colors.onSurface },
  bookListItem: { padding: 20, borderBottomWidth: 1, borderColor: colors.outlineVariant },
  bookListTitle: { ...typography.headlineSm, color: colors.onSurface },
  bookListAuthor: { ...typography.bodyMd, color: colors.onSurfaceVariant },
  emptyText: { padding: 20, textAlign: 'center', color: colors.outline, ...typography.bodyMd },
});
