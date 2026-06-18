import React from 'react';
import { ScrollView, Pressable, Text, StyleSheet, View } from 'react-native';
import { Colors, Radii, Spacing } from '@/constants/colors';
import type { Language, ReadStatus } from '@/types/book';
import { LANGUAGE_OPTIONS, STATUS_OPTIONS } from '@/constants/languages';

interface FilterBarProps {
  activeStatus: ReadStatus | 'all';
  activeLanguage: Language | 'all';
  onStatusChange: (v: ReadStatus | 'all') => void;
  onLanguageChange: (v: Language | 'all') => void;
}

interface ChipProps {
  label: string;
  active: boolean;
  onPress: () => void;
  accentColor?: string;
}

function Chip({ label, active, onPress, accentColor = Colors.majorelleBlue }: ChipProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        active && { backgroundColor: accentColor, borderColor: accentColor },
        pressed && styles.chipPressed,
      ]}
    >
      <Text style={[styles.chipText, active && styles.chipTextActive]}>
        {label}
      </Text>
    </Pressable>
  );
}

export default function FilterBar({
  activeStatus,
  activeLanguage,
  onStatusChange,
  onLanguageChange,
}: FilterBarProps) {
  return (
    <View style={styles.wrapper}>
      {/* Status row */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
      >
        {STATUS_OPTIONS.map((opt) => (
          <Chip
            key={opt.value}
            label={opt.label}
            active={activeStatus === opt.value}
            onPress={() => onStatusChange(opt.value as ReadStatus | 'all')}
            accentColor={
              opt.value === 'reading'   ? Colors.terracotta :
              opt.value === 'completed' ? Colors.mintGreen  :
              Colors.majorelleBlue
            }
          />
        ))}
      </ScrollView>

      {/* Language row */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
      >
        {LANGUAGE_OPTIONS.map((opt) => (
          <Chip
            key={opt.value}
            label={opt.label}
            active={activeLanguage === opt.value}
            onPress={() => onLanguageChange(opt.value as Language | 'all')}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: Spacing.sm,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.xs + 2,
    paddingHorizontal: 2,
  },
  chip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    borderRadius: Radii.md,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    backgroundColor: Colors.surface,
  },
  chipPressed: {
    opacity: 0.8,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.onSurfaceVariant,
    letterSpacing: 0.1,
  },
  chipTextActive: {
    color: Colors.onPrimary,
    fontWeight: '600',
  },
});
