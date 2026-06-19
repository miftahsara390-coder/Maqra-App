import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../constants/theme';

export interface BottomNavBarProps {
  activeTab?: string;
  onTabPress?: (tabId: string) => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({ activeTab = 'Library', onTabPress }) => {
  const tabs = [
    { id: 'Library', icon: 'menu-book' as const, label: 'Library' },
    { id: 'Timer', icon: 'timer' as const, label: 'Timer' },
    { id: 'Stats', icon: 'leaderboard' as const, label: 'Stats' },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.navContainer}>
        <View style={styles.zelligePattern} />
        
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              style={styles.tabButton}
              onPress={() => onTabPress && onTabPress(tab.id)}
              activeOpacity={0.7}
            >
              {isActive && <View style={styles.activeIndicator} />}
              <MaterialIcons
                name={tab.icon}
                size={24}
                color={isActive ? theme.colors.primary : theme.colors.outline}
              />
              <Text
                style={[
                  styles.tabLabel,
                  isActive && styles.tabLabelActive,
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(253, 249, 243, 0.95)',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    borderTopWidth: 1,
    borderTopColor: 'rgba(120, 117, 134, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.06,
    shadowRadius: 30,
    elevation: 20,
  },
  navContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 8,
    position: 'relative',
    overflow: 'hidden',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  },
  zelligePattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    opacity: 0.05,
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 8,
    position: 'relative',
  },
  activeIndicator: {
    position: 'absolute',
    top: -12,
    width: 48,
    height: 4,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.full,
  },
  tabLabel: {
    ...theme.typography['label-sm'],
    fontSize: 10,
    marginTop: 4,
    textTransform: 'uppercase',
    color: theme.colors.outline,
    letterSpacing: -0.5,
  },
  tabLabelActive: {
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
});

export default BottomNavBar;
