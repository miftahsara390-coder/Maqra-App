import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { theme } from '../constants/theme';
import { MaterialIcons } from '@expo/vector-icons';

export interface ProgressRingProps {
  progress?: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  trackColor?: string;
  children?: React.ReactNode;
  showStar?: boolean;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  progress = 0,
  size = 176,
  strokeWidth = 6,
  color = theme.colors.primary,
  trackColor = theme.colors['surface-container-high'],
  children,
  showStar = false,
}) => {
  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - progress * circumference;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width="100%" height="100%" viewBox="0 0 100 100">
        <Circle
          cx="50"
          cy="50"
          r={radius}
          fill="transparent"
          stroke={trackColor}
          strokeWidth={strokeWidth}
        />
        <Circle
          cx="50"
          cy="50"
          r={radius}
          fill="transparent"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          origin="50, 50"
          rotation="-90"
        />
      </Svg>
      <View style={styles.contentContainer}>
        {children}
      </View>
      {showStar && (
        <MaterialIcons
          name="star-border"
          size={14}
          color={theme.colors.gold}
          style={styles.starIcon as any}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  starIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
    opacity: 0.6,
  },
});

export default ProgressRing;
