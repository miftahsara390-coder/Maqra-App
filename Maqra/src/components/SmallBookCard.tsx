import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '../constants/theme';

export interface SmallBookCardProps {
  title: string;
  author?: string;
  coverUrl: string;
}

export const SmallBookCard: React.FC<SmallBookCardProps> = ({
  title,
  author,
  coverUrl,
}) => {
  return (
    <TouchableOpacity activeOpacity={0.9} style={styles.cardContainer}>
      <View style={styles.coverContainer}>
        <Image source={{ uri: coverUrl }} style={styles.coverImage} />
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        {author && (
          <Text style={styles.author} numberOfLines={1}>
            {author}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    width: 140,
    marginRight: theme.spacing.md,
  },
  coverContainer: {
    width: '100%',
    height: 200,
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(120, 117, 134, 0.1)',
  },
  coverImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  contentContainer: {
    paddingHorizontal: 4,
  },
  title: {
    ...theme.typography['headline-sm'],
    fontSize: 16,
    lineHeight: 22,
    color: theme.colors.primary,
    marginBottom: 2,
  },
  author: {
    ...theme.typography['body-md'],
    fontSize: 14,
    color: theme.colors['on-surface-variant'],
    opacity: 0.8,
  },
});

export default SmallBookCard;
