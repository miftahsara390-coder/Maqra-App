/**
 * Add Book — Modal / Screen (UI only, no business logic)
 *
 * Form to add a new book to the library:
 *  - Title, Author inputs
 *  - Total pages input
 *  - Language selector (FR / AR / AMZ)
 *  - Status selector
 *  - Cover photo button (camera)
 *  - Save / Cancel actions
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
  Alert,
  Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useBookStore } from '../store/useBookStore';
import { Colors, Radii, Shadows, Spacing } from '@/constants/colors';
import type { Language, ReadStatus } from '@/types/book';
import { LANGUAGE_LABELS, STATUS_LABELS } from '@/constants/languages';

const LANGUAGES: Language[]   = ['fr', 'ar', 'amz'];
const STATUSES: ReadStatus[]  = ['to_read', 'reading', 'completed'];

const COVER_PALETTE = [
  '#4734C3', '#9F402D', '#005A40',
  '#5847D3', '#C44B25', '#006E51',
  '#7B61D4', '#E67E5E', '#3EB489',
];

export default function AddBookScreen() {
  const router = useRouter();
  const { addBook } = useBookStore();

  const [title,    setTitle]    = useState('');
  const [author,   setAuthor]   = useState('');
  const [pages,    setPages]    = useState('');
  const [language, setLanguage] = useState<Language>('fr');
  const [status,   setStatus]   = useState<ReadStatus>('to_read');
  const [cover,    setCover]    = useState(COVER_PALETTE[0]);
  const [coverUri, setCoverUri] = useState<string | null>(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.8,
    });

    if (!result.canceled) {
      setCoverUri(result.assets[0].uri);
    }
  };

  const handleSave = () => {
    if (!title.trim() || !author.trim() || !pages.trim()) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs obligatoires.");
      return;
    }

    addBook({
      title,
      author,
      totalPages: parseInt(pages) || 0,
      currentPage: status === 'completed' ? parseInt(pages) || 0 : 0,
      language,
      status,
      coverColor: cover,
      coverImage: coverUri || undefined,
    });

    router.back();
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <View style={styles.header}>
        <Pressable style={styles.cancelBtn} onPress={() => router.back()} accessibilityLabel="Annuler">
          <Text style={styles.cancelText}>Annuler</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Nouveau livre</Text>
        <Pressable style={styles.saveBtn} onPress={handleSave} accessibilityLabel="Enregistrer">
          <Text style={styles.saveText}>Enregistrer</Text>
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Cover picker ─────────────────────────────────────────────────── */}
        <View style={styles.coverSection}>
          <View style={[styles.coverPreview, { backgroundColor: cover }]}>
            {coverUri ? (
              <Image source={{ uri: coverUri }} style={styles.coverImage} />
            ) : (
              <Text style={styles.coverPreviewLetter}>
                {title.charAt(0) || '?'}
              </Text>
            )}
          </View>

          {/* Color palette */}
          <View style={styles.palette}>
            {COVER_PALETTE.map((color) => (
              <Pressable
                key={color}
                onPress={() => setCover(color)}
                style={[
                  styles.paletteCircle,
                  { backgroundColor: color },
                  cover === color && styles.paletteCircleActive,
                ]}
              />
            ))}
          </View>

          <Pressable style={styles.cameraBtn} onPress={pickImage}>
            <Text style={styles.cameraBtnText}>📷  Prendre une photo</Text>
          </Pressable>
        </View>

        {/* ── Fields ───────────────────────────────────────────────────────── */}
        <View style={styles.fieldsCard}>
          {/* Title */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Titre *</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="Saisir le titre..."
              placeholderTextColor={Colors.outline}
              returnKeyType="next"
            />
          </View>

          <View style={styles.separator} />

          {/* Author */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Auteur *</Text>
            <TextInput
              style={styles.input}
              value={author}
              onChangeText={setAuthor}
              placeholder="Nom de l'auteur..."
              placeholderTextColor={Colors.outline}
              returnKeyType="next"
            />
          </View>

          <View style={styles.separator} />

          {/* Pages */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Nombre de pages *</Text>
            <TextInput
              style={styles.input}
              value={pages}
              onChangeText={setPages}
              placeholder="ex: 320"
              placeholderTextColor={Colors.outline}
              keyboardType="number-pad"
              returnKeyType="done"
            />
          </View>
        </View>

        {/* ── Language selector ─────────────────────────────────────────────── */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionLabel}>Langue</Text>
          <View style={styles.optionRow}>
            {LANGUAGES.map((lang) => (
              <Pressable
                key={lang}
                onPress={() => setLanguage(lang)}
                style={[
                  styles.optionChip,
                  language === lang && styles.optionChipActive,
                ]}
              >
                <Text style={[
                  styles.optionChipText,
                  language === lang && styles.optionChipTextActive,
                ]}>
                  {LANGUAGE_LABELS[lang]}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* ── Status selector ───────────────────────────────────────────────── */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionLabel}>Statut</Text>
          <View style={styles.optionRow}>
            {STATUSES.map((s) => (
              <Pressable
                key={s}
                onPress={() => setStatus(s)}
                style={[
                  styles.optionChip,
                  status === s && styles.optionChipActive,
                ]}
              >
                <Text style={[
                  styles.optionChipText,
                  status === s && styles.optionChipTextActive,
                ]}>
                  {STATUS_LABELS[s]}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* ── Save button (bottom) ──────────────────────────────────────────── */}
        <Pressable
          style={({ pressed }) => [styles.mainSaveBtn, pressed && { opacity: 0.88 }]}
          onPress={handleSave}
          accessibilityLabel="Ajouter le livre"
          accessibilityRole="button"
        >
          <Text style={styles.mainSaveBtnText}>Ajouter à la bibliothèque</Text>
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

  // ── Header ─────────────────────────────────────────────────────────────────
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.gutter,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight ?? 0) + 8 : 8,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  cancelBtn: {
    paddingVertical: Spacing.xs,
    paddingRight: Spacing.md,
  },
  cancelText: {
    fontSize: 16,
    color: Colors.outline,
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.onSurface,
    letterSpacing: -0.3,
  },
  saveBtn: {
    paddingVertical: Spacing.xs,
    paddingLeft: Spacing.md,
  },
  saveText: {
    fontSize: 16,
    color: Colors.primaryContainer,
    fontWeight: '700',
  },

  // ── Content ────────────────────────────────────────────────────────────────
  content: {
    padding: Spacing.gutter,
    gap: Spacing.md,
    paddingBottom: Spacing.xl * 2,
  },

  // ── Cover picker ───────────────────────────────────────────────────────────
  coverSection: {
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.md,
  },
  coverPreview: {
    width: 100,
    height: 140,
    borderRadius: Radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    ...Shadows.active,
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  coverPreviewLetter: {
    fontSize: 48,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.85)',
  },
  palette: {
    flexDirection: 'row',
    gap: Spacing.sm,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  paletteCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  paletteCircleActive: {
    borderColor: Colors.onSurface,
    transform: [{ scale: 1.15 }],
  },
  cameraBtn: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Radii.full,
    borderWidth: 1.5,
    borderColor: Colors.primaryContainer,
    backgroundColor: Colors.onPrimaryContainer,
  },
  cameraBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primaryContainer,
  },

  // ── Fields card ────────────────────────────────────────────────────────────
  fieldsCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    ...Shadows.card,
  },
  fieldGroup: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    gap: 4,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.outline,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  input: {
    fontSize: 16,
    color: Colors.onSurface,
    fontWeight: '400',
    padding: 0,
    paddingTop: 4,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.border,
    marginHorizontal: Spacing.md,
  },

  // ── Section card ───────────────────────────────────────────────────────────
  sectionCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    gap: Spacing.sm,
    ...Shadows.card,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.outline,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  optionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  optionChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    borderRadius: Radii.full,
    borderWidth: 1.5,
    borderColor: Colors.outlineVariant,
    backgroundColor: Colors.background,
  },
  optionChipActive: {
    backgroundColor: Colors.primaryContainer,
    borderColor: Colors.primaryContainer,
  },
  optionChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.onSurfaceVariant,
  },
  optionChipTextActive: {
    color: Colors.onPrimary,
    fontWeight: '700',
  },

  // ── Main save button ───────────────────────────────────────────────────────
  mainSaveBtn: {
    backgroundColor: Colors.primaryContainer,
    borderRadius: Radii.full,
    paddingVertical: Spacing.md + 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.sm,
    ...Shadows.active,
  },
  mainSaveBtnText: {
    color: Colors.onPrimary,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
