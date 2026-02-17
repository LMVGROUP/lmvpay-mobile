import { Stack } from 'expo-router';

export default function HealthLayout() {
    return (
        <Stack screenOptions={{
            headerShown: false,
        }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="CarForm" />
            <Stack.Screen name="BikeForm" />
            <Stack.Screen name="CommercialForm" />
            <Stack.Screen name="Quotations"/>
            <Stack.Screen name="addOn"/>
        </Stack>
    );
}
