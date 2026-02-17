import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useEffect } from 'react';

import { Provider } from 'react-redux';
import { store } from '../store/store';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  // Check if store is initialized

  return (
    <Provider store={store}>
      <>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="modal"
            options={{ presentation: 'modal', title: 'Modal' }}
          />
        </Stack>
        <StatusBar style="auto" />
      </>
    </Provider>
  );
}