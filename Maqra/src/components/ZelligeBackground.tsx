import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../theme/colors';
import Svg, { Defs, RadialGradient, Rect, Stop, Pattern, Path } from 'react-native-svg';

interface Props {
  style?: ViewStyle;
  opacity?: number;
}

export const ZelligeBackground: React.FC<Props> = ({ style, opacity = 1 }) => {
  return (
    <View style={[StyleSheet.absoluteFill, style, { opacity }]}>
      <Svg height="100%" width="100%">
        <Defs>
          <Pattern id="zellige" width="60" height="100" patternUnits="userSpaceOnUse">
            {/* Base Background */}
            <Rect width="60" height="100" fill={colors.surface} />
            
            {/* Subtle Tiled Geometric Elements */}
            <Path
              d="M 30 0 L 60 25 L 60 75 L 30 100 L 0 75 L 0 25 Z"
              fill={colors.surfaceContainer}
              stroke={colors.surfaceContainerLow}
              strokeWidth="1"
            />
            <Path
              d="M 30 25 L 45 37.5 L 45 62.5 L 30 75 L 15 62.5 L 15 37.5 Z"
              fill={colors.surface}
            />
            <Path
              d="M 30 50 L 37.5 56.25 L 30 62.5 L 22.5 56.25 Z"
              fill={colors.surfaceContainerHigh}
            />
          </Pattern>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#zellige)" />
      </Svg>
    </View>
  );
};
