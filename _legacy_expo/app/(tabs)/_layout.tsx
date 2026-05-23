import { Tabs } from 'expo-router';
import { Edit3, LayoutGrid, BarChart2, Wrench } from 'lucide-react-native';
import { colors } from '../../src/constants/theme';

// Custom tab bar icon component
function TabIcon({ name, color, size }: { name: string; color: string; size: number }) {
  switch (name) {
    case 'capture':
      return <Edit3 size={size} color={color} />;
    case 'incubate':
      return <LayoutGrid size={size} color={color} />;
    case 'insights':
      return <BarChart2 size={size} color={color} />;
    case 'tools':
      return <Wrench size={size} color={color} />;
    default:
      return null;
  }
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          paddingTop: 8,
          paddingBottom: 8,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: '捕获',
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="capture" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="incubate"
        options={{
          title: '孵化',
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="incubate" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="insights"
        options={{
          title: '洞察',
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="insights" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="tools"
        options={{
          title: '工具',
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="tools" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
