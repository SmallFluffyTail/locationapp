import { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Text, TextInput, Button, HelperText } from 'react-native-paper';
import { useAuth } from '../context/AuthContext';
import { COLORS, globalStyles } from '../theme/theme';

/**
 * Rekisteröitymisnäyttö uuden käyttäjätilin luominen.
 * Käyttäjä syöttää sähköpostin, salasanan ja salasanavahvistuksen.
 * Lomake validoidaan ennen rekisteröinnin lähettämistä.
 */

export default function RegisterScreen({ navigation }) {
  const { register } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);


/**
   * Käsittelee rekisteröinnin.
   * Validoi kentät järjestyksessä ennen API-kutsua:
   * 1. Kaikki kentät täytetty
   * 2. Salasanat täsmäävät
   * 3. Salasana on vähintään 6 merkkiä pitkä
   */

  const handleRegister = async () => {
    setError('');
    if (!email || !password || !confirm) {
      setError('Please fill in all fields.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      await register(email.trim(), password);
    } catch (e) {
      setError('Registration failed. This email may already be in use.');
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
          <Text style={styles.subtitle}>Create a new account</Text>
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
            secureTextEntry
            mode="outlined"
            style={globalStyles.input}
            outlineColor={COLORS.border}
            activeOutlineColor={COLORS.primary}
          />
          <TextInput
            label="Confirm Password"
            value={confirm}
            onChangeText={setConfirm}
            secureTextEntry
            mode="outlined"
            style={globalStyles.input}
            outlineColor={COLORS.border}
            activeOutlineColor={COLORS.primary}
          />

          {error ? (
            <HelperText type="error" visible={true} style={{ color: COLORS.error }}>
              ⚠️ {error}
            </HelperText>
          ) : null}

          <Button
            mode="contained"
            onPress={handleRegister}
            loading={loading}
            disabled={loading}
            style={globalStyles.button}
            contentStyle={globalStyles.buttonContent}
            buttonColor={COLORS.primary}
          >
            Create Account
          </Button>

          <Button
            mode="text"
            onPress={() => navigation.navigate('Login')}
            textColor={COLORS.secondary}
            style={{ marginTop: 8 }}
          >
            Already have an account? Sign In
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

/*tyylit*/

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  header: { alignItems: 'center', marginBottom: 40 },
  appTitle: { fontSize: 32, fontWeight: '800', color: COLORS.primary, marginBottom: 8 },
  subtitle: { fontSize: 16, color: COLORS.textLight },
  form: { backgroundColor: COLORS.surface, borderRadius: 16, padding: 20, elevation: 4 },
});