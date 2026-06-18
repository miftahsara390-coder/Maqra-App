/**
 * ProgressRing — Pure React Native, no external dependencies.
 * Uses the two-half-clip technique with individual border colors.
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/colors';

interface ProgressRingProps {
  /** 0 – 1 ratio */
  progress: number;
  size?: number;
  strokeWidth?: number;
  centerLabel?: string;
  subLabel?: string;
  color?: string;
}

export default function ProgressRing({
  progress,
  size = 130,
  strokeWidth = 10,
  centerLabel,
  subLabel,
  color = Colors.majorelleBlue,
}: ProgressRingProps) {
  const clamped  = Math.min(Math.max(progress, 0), 1);
  const half     = size / 2;
  const angle    = clamped * 360;

  // First 180° (0 % → 50 %): rotate the right-half clip from hidden (−180°) to full (0°).
  const firstRot  = Math.min(angle, 180) - 180;

  // Next 180° (50 % → 100 %): rotate the left-half clip from hidden (0°) to full (180°).
  const secondRot = angle > 180 ? angle - 180 : 0;

  // Shared ring style — using individual border colours so only the correct
  // half is coloured; the transparent half is genuinely invisible.
  const ringBase = {
    position: 'absolute' as const,
    width:  size,
    height: size,
    borderRadius: half,
    borderWidth: strokeWidth,
  };

  return (
    <View style={[styles.container, { width: size, height: size }]}>

      {/* ── Track (background ring) ───────────────────────────────────────── */}
      <View style={[ringBase, { borderColor: color + '20' }]} />

      {/* ── Right-half clip  (covers 0 % → 50 %) ─────────────────────────── */}
      <View style={{ position: 'absolute', left: half, top: 0, width: half, height: size, overflow: 'hidden' }}>
        <View style={[
          ringBase,
          {
            left: -half,
            // top + right borders are coloured; bottom + left are transparent.
            // This creates a clockwise arc starting from 12 o'clock.
            borderTopColor:    color,
            borderRightColor:  color,
            borderBottomColor: 'transparent',
            borderLeftColor:   'transparent',
            transform: [{ rotate: `${firstRot}deg` }],
          },
        ]} />
      </View>

      {/* ── Left-half clip  (covers 50 % → 100 %) ────────────────────────── */}
      {clamped > 0.5 && (
        <View style={{ position: 'absolute', left: 0, top: 0, width: half, height: size, overflow: 'hidden' }}>
          <View style={[
            ringBase,
            {
              left: 0,
              // bottom + left borders coloured; top + right transparent.
              borderBottomColor: color,
              borderLeftColor:   color,
              borderTopColor:    'transparent',
              borderRightColor:  'transparent',
              transform: [{ rotate: `${secondRot}deg` }],
            },
          ]} />
        </View>
      )}

      {/* ── Center labels (not part of the rotating ring) ─────────────────── */}
      <View style={styles.centerContent}>
        {centerLabel ? (
          <Text style={styles.centerLabel}>{centerLabel}</Text>
        ) : (
          <Text style={styles.percentLabel}>
            {Math.round(clamped * 100)}%
          </Text>
        )}
        {subLabel ? (
          <Text style={styles.subLabel}>{subLabel}</Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerContent: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    // FIX: pointerEvents moved to style in React Native 0.71+
    pointerEvents: 'none',
  },
  centerLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.ink,
    letterSpacing: -0.5,
  },
  percentLabel: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.ink,
    letterSpacing: -0.5,
  },
  subLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: Colors.onSurfaceVariant,
    marginTop: 2,
    textAlign: 'center',
  },
});
