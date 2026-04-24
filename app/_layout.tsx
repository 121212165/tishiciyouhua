import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import ErrorBoundary from '../src/components/ErrorBoundary';
import { colors } from '../src/constants/theme';

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.primary,
          },
          headerTintColor: colors.tagTextSelected,
          headerTitleStyle: {
            fontWeight: '600',
          },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="refine/[id]"
          options={{
            title: '需求提炼',
            presentation: 'modal',
          }}
        />
      </Stack>
    </ErrorBoundary>
  );
}