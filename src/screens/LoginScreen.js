import { useState } from 'react';
import { View, StyleSheet, Image, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Text, TextInput, Button, HelperText } from 'react-native-paper';
import { useAuth } from '../context/AuthContext';
import { COLORS, globalStyles } from '../theme/theme';

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await login(email.trim(), password);
    } catch (e) {
      setError('Login failed. Check your email and password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.appTitle}>📍 LocationApp</Text>
          <Text style={styles.subtitle}>Sign in to your account</Text>
        </View>

        <View style={styles.form}>
          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            keyboardType="email-address"
            autoCapitalize="none"
            style={globalStyles.input}
            outlineColor={COLORS.border}
            activeOutlineColor={COLORS.primary}
          />
          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            mode="outlined"
            style={globalStyles.input}
            outlineColor={COLORS.border}
            activeOutlineColor={COLORS.primary}
            right={
              <TextInput.Icon
                icon={showPassword ? 'eye-off' : 'eye'}
                onPress={() => setShowPassword(!showPassword)}
              />
            }
          />

          {error ? (
            <HelperText type="error" visible={true} style={styles.errorText}>
              ⚠️ {error}
            </HelperText>
          ) : null}

          <Button
            mode="contained"
            onPress={handleLogin}
            loading={loading}
            disabled={loading}
            style={globalStyles.button}
            contentStyle={globalStyles.buttonContent}
            buttonColor={COLORS.primary}
          >
            Sign In
          </Button>

          <Button
            mode="text"
            onPress={() => navigation.navigate('Register')}
            textColor={COLORS.secondary}
            style={{ marginTop: 8 }}
          >
            Don't have an account? Register
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  header: { alignItems: 'center', marginBottom: 40 },
  appTitle: { fontSize: 32, fontWeight: '800', color: COLORS.primary, marginBottom: 8 },
  subtitle: { fontSize: 16, color: COLORS.textLight },
  form: { backgroundColor: COLORS.surface, borderRadius: 16, padding: 20, elevation: 4 },
  errorText: { color: COLORS.error, marginBottom: 8 },
});