import { StatusBar } from 'expo-status-bar';
import { PaperProvider } from 'react-native-paper';
import { theme } from './src/theme/theme';
import AppNavigator from './src/navigation/AppNavigator';
import { AuthProvider } from './src/context/AuthContext';
import { LocationProvider } from './src/context/LocationContext';

export default function App() {
  return (
    <AuthProvider>
      <LocationProvider>
        <PaperProvider theme={theme}>
          <StatusBar style="light" />
          <AppNavigator />
        </PaperProvider>
      </LocationProvider>
    </AuthProvider>
  );
}