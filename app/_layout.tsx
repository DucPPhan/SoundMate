import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { SoundMateColors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

// Custom dark theme with SoundMate colors
const SoundMateDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: SoundMateColors.primary,
    background: SoundMateColors.background,
    card: SoundMateColors.surface,
    text: SoundMateColors.textPrimary,
    border: SoundMateColors.border,
    notification: SoundMateColors.primary,
  },
};

export const unstable_settings = {
  initialRouteName: 'login',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? SoundMateDarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="light" />
    </ThemeProvider>
  );
}

