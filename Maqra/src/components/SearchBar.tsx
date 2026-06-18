import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Colors, Radii, Spacing } from '@/constants/colors';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export default function SearchBar({
  value,
  onChangeText,
  placeholder = 'Rechercher par titre ou auteur...',
}: SearchBarProps) {
  return (
    <View style={styles.container}>
      {/* Search icon */}
      <View style={styles.iconWrap}>
        <View style={styles.iconCircle} />
        <View style={styles.iconHandle} />
      </View>

      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.outline}
        returnKeyType="search"
        clearButtonMode="while-editing"
        autoCorrect={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radii.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
    gap: Spacing.sm,
  },
  iconWrap: {
    width: 18,
    height: 18,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Colors.outline,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  iconHandle: {
    width: 6,
    height: 2,
    backgroundColor: Colors.outline,
    borderRadius: 1,
    position: 'absolute',
    bottom: 0,
    right: 0,
    transform: [{ rotate: '45deg' }],
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: Colors.onSurface,
    padding: 0,
    fontWeight: '400',
  },
});
