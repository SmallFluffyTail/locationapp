import { useEffect } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Text, Card, Button, IconButton, Chip } from 'react-native-paper';
import { useAuth } from '../context/AuthContext';
import { useLocations } from '../context/LocationContext';
import { COLORS, globalStyles } from '../theme/theme';

/*Tähtivalitsin :P */

function StarRating({ rating }) {
  return (
    <View style={{ flexDirection: 'row', marginVertical: 4 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Text key={i} style={{ fontSize: 18, color: i <= rating ? COLORS.star : COLORS.border }}>
          ★
        </Text>
      ))}
    </View>
  );
}

/**
 * Kotinäyttö listaa käyttäjän tallentamat sijainnit ja tarjoaa mahdollisuuden lisätä uusia tai tarkastella niitä kartalla.
 */

export default function HomeScreen({ navigation }) {
  const { user, logout } = useAuth();
  const { locations, fetchLocations } = useLocations();

  useEffect(() => {
    fetchLocations();
  }, []);

  const renderItem = ({ item }) => (
    <Card style={globalStyles.card}>
      <Card.Content>
        <Text style={styles.locationName}>📍 {item.name}</Text>
        <Text style={styles.description}>{item.description}</Text>
        <StarRating rating={item.rating} />
      </Card.Content>
      <Card.Actions>
        <Button
          mode="outlined"
          textColor={COLORS.primary}
          onPress={() =>
                    navigation.navigate('Map', { locationName: item.name })
          }
        >
          View on Map
        </Button>
      </Card.Actions>
    </Card>
  );

  return (
    <View style={globalStyles.container}>
      {/* Header with username and logout */}
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Welcome,</Text>
          <Text style={styles.emailText}>{user?.email}</Text>
        </View>
        <Button mode="outlined" onPress={logout} textColor={COLORS.error} compact>
          Logout
        </Button>
      </View>

      <FlatList
        data={locations}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No locations yet.</Text>
            <Text style={styles.emptySubText}>Tap the button below to add one!</Text>
          </View>
        }
      />

      <View style={styles.fab}>
        <Button
          mode="contained"
          icon="plus"
          onPress={() => navigation.navigate('AddLocation')}
          buttonColor={COLORS.primary}
          style={{ borderRadius: 28 }}
          contentStyle={{ paddingHorizontal: 12 }}
        >
          Add Location
        </Button>
      </View>
    </View>
  );
}

/*tyylit*/

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: COLORS.primary,
  },
  welcomeText: { color: COLORS.accent, fontSize: 12 },
  emailText: { color: COLORS.white, fontWeight: '700', fontSize: 14 },
  list: { padding: 16, paddingBottom: 80 },
  locationName: { fontSize: 18, fontWeight: '700', color: COLORS.text },
  description: { color: COLORS.darkText, marginTop: 4, fontSize: 14 },
  empty: { alignItems: 'center', marginTop: 60 },
  emptyText: { fontSize: 18, color: COLORS.text, fontWeight: '600' },
  emptySubText: { color: COLORS.textLight, marginTop: 4 },
  fab: { position: 'absolute', bottom: 20, right: 20 },
});