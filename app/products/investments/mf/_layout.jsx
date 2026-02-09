import { Stack } from 'expo-router';

export default function HealthLayout() {
    return (
        <Stack screenOptions={{
            headerShown: false,
        }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="portpolio" />
             <Stack.Screen name="order" />
              <Stack.Screen name="funddetail" />
        </Stack>
    );
}
