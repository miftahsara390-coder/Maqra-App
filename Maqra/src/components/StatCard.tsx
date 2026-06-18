import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Radii, Shadows, Spacing } from '@/constants/colors';

interface StatCardProps {
  value: string | number;
  label: string;
  accent?: string;
}

export default function StatCard({
  value,
  label,
  accent = Colors.majorelleBlue,
}: StatCardProps) {
  return (
    <View style={styles.card}>
      {/* Zellige watermark — subtle geometric accent at 5% opacity */}
      <View style={styles.zelligeMark}>
        <View style={[styles.zelliges, { borderColor: accent + '0D' }]} />
        <View style={[styles.zelliges, styles.zelligeDiag, { borderColor: accent + '0D' }]} />
      </View>

      <Text style={[styles.value, { color: accent }]}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: Radii.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 80,
    overflow: 'hidden',
    ...Shadows.card,
  },
  zelligeMark: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 48,
    height: 48,
  },
  zelliges: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderWidth: 6,
    borderRadius: 4,
    top: 4,
    right: 4,
  },
  zelligeDiag: {
    transform: [{ rotate: '45deg' }],
    top: 14,
    right: 14,
    width: 24,
    height: 24,
  },
  value: {
    fontSize: 26,
    fontWeight: '700',
    letterSpacing: -0.5,
    lineHeight: 32,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.onSurfaceVariant,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 2,
    textAlign: 'center',
  },
});
