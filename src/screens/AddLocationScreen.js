import { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, TextInput, Button, Switch, HelperText } from 'react-native-paper';
import { useLocations } from '../context/LocationContext';
import { COLORS, globalStyles } from '../theme/theme';

/**
 * Tähtivalitsin-komponentti, jolla käyttäjä voi antaa arvosanan 1–5 tähteä.
 * Aktiiviset tähdet näytetään korostettuna, loput harmaana.
 */
function StarSelector({ value, onChange }) {
  return (
    <View style={styles.stars}>
      {[1, 2, 3, 4, 5].map((i) => (
        <TouchableOpacity key={i} onPress={() => onChange(i)}>
          <Text style={{ fontSize: 36, color: i <= value ? COLORS.star : COLORS.border }}>
            ★
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

/**
 * Näyttö uuden sijainnin lisäämiseen.
 * Käyttäjä voi syöttää nimen, kuvauksen, arvosanan sekä valita jaetaanko sijainti kaikkien käyttäjien nähtäväksi.
 */

export default function AddLocationScreen({ navigation }) {
  const { addLocation } = useLocations();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [rating, setRating] = useState(3);
  const [isShared, setIsShared] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setError('');
    if (!name.trim()) {
      setError('Location name is required.');
      return;
    }
    if (!description.trim()) {
      setError('Description is required.');
      return;
    }
    setLoading(true);
    try {
      await addLocation(name.trim(), description.trim(), rating, isShared);
      navigation.goBack();
    } catch (e) {
      setError('Failed to save location. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={globalStyles.container} contentContainerStyle={styles.content}>
      <TextInput
        label="Location Name *"
        value={name}
        onChangeText={setName}
        mode="outlined"
        style={globalStyles.input}
        outlineColor={COLORS.border}
        activeOutlineColor={COLORS.primary}
        placeholder="e.g. New York"
      />
      <TextInput
        label="Description *"
        value={description}
        onChangeText={setDescription}
        mode="outlined"
        multiline
        numberOfLines={4}
        style={[globalStyles.input, { height: 100 }]}
        outlineColor={COLORS.border}
        activeOutlineColor={COLORS.primary}
        placeholder="Describe this location..."
      />

      <Text style={styles.label}>Rating</Text>
      <StarSelector value={rating} onChange={setRating} />

      <View style={styles.switchRow}>
        <View>
          <Text style={styles.label}>Share with everyone?</Text>
          <Text style={styles.switchSubtext}>Shared locations are visible to all users</Text>
        </View>
        <Switch
          value={isShared}
          onValueChange={setIsShared}
          color={COLORS.primary}
        />
      </View>

      {error ? (
        <HelperText type="error" visible={true} style={{ color: COLORS.error }}>
          ⚠️ {error}
        </HelperText>
      ) : null}

      <Button
        mode="contained"
        onPress={handleSave}
        loading={loading}
        disabled={loading}
        style={[globalStyles.button, { marginTop: 16 }]}
        contentStyle={globalStyles.buttonContent}
        buttonColor={COLORS.primary}
        icon="content-save"
      >
        Save Location
      </Button>

      <Button
        mode="outlined"
        onPress={() => navigation.goBack()}
        style={{ marginTop: 8 }}
        textColor={COLORS.text}
      >
        Cancel
      </Button>
    </ScrollView>
  );
}
/*Tyylit*/
const styles = StyleSheet.create({
  content: { padding: 16 },
  label: { fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: 4, marginTop: 8 },
  stars: { flexDirection: 'row', marginBottom: 16 },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.cardBg,
    borderRadius: 10,
    padding: 12,
    marginVertical: 8,
  },
  switchSubtext: { fontSize: 12, color: COLORS.textLight, marginTop: 2 },
});