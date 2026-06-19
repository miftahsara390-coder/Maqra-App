import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, typography } from '../../theme/colors';
import { View, StyleSheet } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.outline,
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontFamily: typography.labelSm.fontFamily,
          fontSize: 10,
          textTransform: 'uppercase',
          fontWeight: 'bold',
          marginTop: 2,
        },
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: 'rgba(253, 249, 243, 0.95)', // surface with opacity
          borderTopWidth: 1,
          borderTopColor: 'rgba(120, 117, 134, 0.1)', // outline with 10% opacity
          height: 80,
          paddingBottom: 24,
          paddingTop: 12,
          borderTopLeftRadius: 40,
          borderTopRightRadius: 40,
          elevation: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -8 },
          shadowOpacity: 0.06,
          shadowRadius: 30,
        },
        tabBarBackground: () => (
          <View style={[StyleSheet.absoluteFill, { backgroundColor: 'transparent' }]} />
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Library',
          tabBarIcon: ({ color, focused }) => (
            <View style={{ alignItems: 'center' }}>
              {focused && (
                <View
                  style={{
                    position: 'absolute',
                    top: -16,
                    width: 24,
                    height: 4,
                    backgroundColor: colors.primary,
                    borderRadius: 2,
                  }}
                />
              )}
              <MaterialIcons name="auto-stories" size={24} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="timer"
        options={{
          title: 'Timer',
          tabBarIcon: ({ color }) => (
            <View style={{ alignItems: 'center' }}>
              <MaterialIcons name="timer" size={24} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: 'Stats',
          tabBarIcon: ({ color }) => (
            <View style={{ alignItems: 'center' }}>
              <MaterialIcons name="leaderboard" size={24} color={color} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
