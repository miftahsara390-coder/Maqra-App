import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '../constants/theme';

export interface BookCardProps {
  title: string;
  author: string;
  coverUrl: string;
  status: string;
  language: string;
  progress?: number;
  isRtl?: boolean;
  statusType?: 'en_cours' | 'a_lire' | 'premium' | 'termine';
}

export const BookCard: React.FC<BookCardProps> = ({
  title,
  author,
  coverUrl,
  status,
  language,
  progress = 0,
  isRtl = false,
  statusType = 'en_cours',
}) => {
  const getStatusStyles = () => {
    switch (statusType) {
      case 'a_lire':
        return {
          container: styles.statusBadgeSecondary,
          text: styles.statusTextWhite,
        };
      case 'premium':
        return {
          container: styles.statusBadgePremium,
          text: styles.statusTextPremium,
        };
      case 'termine':
        return {
          container: styles.statusBadgeTertiary,
          text: styles.statusTextWhite,
        };
      case 'en_cours':
      default:
        return {
          container: styles.statusBadgeEnCours,
          text: styles.statusTextTertiary,
        };
    }
  };

  const statusStyle = getStatusStyles();

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={[
        styles.cardContainer,
        isRtl && styles.cardContainerRtl,
        statusType === 'premium' && styles.cardContainerPremium,
      ]}
    >
      <View style={styles.moorishArchBackground} />
      
      <View style={styles.coverContainer}>
        <Image source={{ uri: coverUrl }} style={styles.coverImage} />
      </View>

      <View style={[styles.contentContainer, isRtl && styles.contentContainerRtl]}>
        <View>
          <View style={[styles.headerRow, isRtl && styles.headerRowRtl]}>
            <Text
              style={[
                styles.title,
                isRtl ? theme.typography.arabic : theme.typography['headline-sm'],
                isRtl && styles.textRight,
              ]}
              numberOfLines={1}
            >
              {title}
            </Text>
            <View style={statusStyle.container}>
              <Text style={statusStyle.text}>{status}</Text>
            </View>
          </View>
          <Text
            style={[
              styles.author,
              isRtl ? theme.typography.arabic : theme.typography['body-md'],
              isRtl && styles.textRight,
            ]}
          >
            {author}
          </Text>
        </View>

        <View style={[styles.footerRow, isRtl && styles.headerRowRtl]}>
          <View style={styles.languageBadge}>
            <Text style={styles.languageText}>{language}</Text>
          </View>
          <View style={styles.progressBarContainer}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${progress}%` },
                statusType === 'termine' && styles.progressBarFillTermine,
                statusType === 'premium' && styles.progressBarFillPremium,
              ]}
            />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 12,
    borderRadius: theme.borderRadius['2xl'],
    gap: theme.spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(120, 117, 134, 0.1)',
    overflow: 'hidden',
    position: 'relative',
    marginBottom: theme.spacing.md,
  },
  cardContainerPremium: {
    borderColor: 'rgba(212, 175, 55, 0.2)', // gold border
  },
  cardContainerRtl: {
    flexDirection: 'row-reverse',
  },
  moorishArchBackground: {
    position: 'absolute',
    top: -32,
    right: -32,
    width: 64,
    height: 64,
    backgroundColor: 'rgba(71, 52, 195, 0.05)',
    transform: [{ rotate: '45deg' }],
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },
  coverContainer: {
    width: 96,
    height: 128,
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  coverImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  contentContainerRtl: {
    alignItems: 'flex-end',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
  },
  headerRowRtl: {
    flexDirection: 'row-reverse',
  },
  title: {
    color: theme.colors.primary,
    flex: 1,
    lineHeight: 24,
  },
  textRight: {
    textAlign: 'right',
  },
  statusBadgeEnCours: {
    backgroundColor: 'rgba(0, 90, 64, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.DEFAULT,
    borderWidth: 1,
    borderColor: 'rgba(0, 90, 64, 0.2)',
  },
  statusBadgeSecondary: {
    backgroundColor: theme.colors.secondary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.DEFAULT,
  },
  statusBadgePremium: {
    backgroundColor: 'transparent',
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  statusBadgeTertiary: {
    backgroundColor: theme.colors.tertiary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.DEFAULT,
  },
  statusTextTertiary: {
    ...theme.typography['label-sm'],
    fontSize: 10,
    color: theme.colors.tertiary,
    textTransform: 'uppercase',
  },
  statusTextWhite: {
    ...theme.typography['label-sm'],
    fontSize: 10,
    color: theme.colors.white,
    textTransform: 'uppercase',
  },
  statusTextPremium: {
    ...theme.typography['label-sm'],
    fontSize: 10,
    color: theme.colors.gold,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  author: {
    color: theme.colors['on-surface-variant'],
    opacity: 0.8,
    marginTop: 2,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  languageBadge: {
    backgroundColor: theme.colors['surface-container'],
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.DEFAULT,
    borderWidth: 1,
    borderColor: 'rgba(120, 117, 134, 0.05)',
  },
  languageText: {
    ...theme.typography['label-sm'],
    fontSize: 10,
    color: theme.colors.outline,
    textTransform: 'uppercase',
  },
  progressBarContainer: {
    width: 96,
    height: 6,
    backgroundColor: theme.colors['surface-container-high'],
    borderRadius: theme.borderRadius.full,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.full,
  },
  progressBarFillTermine: {
    backgroundColor: theme.colors.tertiary,
  },
  progressBarFillPremium: {
    backgroundColor: theme.colors.outline,
  },
});

export default BookCard;
