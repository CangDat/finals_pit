import { Stack } from "expo-router";
import ToastNotification from '../components/toast'; // Ensure correct import path
import { AuthProvider } from "../components/useContext";


const RootLayout = () => {
    return (
        <AuthProvider>
    <Stack>
        <Stack.Screen name="screens/signupScreen" options={{headerShown: false}}/>
        <Stack.Screen name="screens/loginScreen" options={{headerShown: false}}/>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
    <ToastNotification />
    </AuthProvider>
    )
};

export default RootLayout;