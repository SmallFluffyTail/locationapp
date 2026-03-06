import { useEffect } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Text, Card, Button } from 'react-native-paper';
import { useAuth } from '../context/AuthContext';
import { useLocations } from '../context/LocationContext';
import { COLORS, globalStyles } from '../theme/theme';

function StarRating({ rating }) {
  return (
    <View style={{ flexDirection: 'row' }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Text key={i} style={{ color: i <= rating ? COLORS.star : COLORS.border, fontSize: 16 }}>
          ★
        </Text>
      ))}
    </View>
  );
}

export default function SharedLocationsScreen() {
  const { user, logout } = useAuth();
  const { sharedLocations, fetchSharedLocations } = useLocations();

  useEffect(() => {
    fetchSharedLocations();
  }, []);

  const renderItem = ({ item }) => (
    <Card style={globalStyles.card}>
      <Card.Content>
        <View style={styles.row}>
          <Text style={styles.locationName}>📍 {item.name}</Text>
          <Text style={styles.sharedBy}>by {item.sharedBy}</Text>
        </View>
        <Text style={styles.description}>{item.description}</Text>
        <StarRating rating={item.rating} />
      </Card.Content>
    </Card>
  );

  return (
    <View style={globalStyles.container}>
      <View style={styles.header}>
        <Text style={styles.emailText}>{user?.email}</Text>
        <Button mode="text" onPress={logout} textColor={COLORS.error} compact>
          Logout
        </Button>
      </View>

      <FlatList
        data={sharedLocations}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No shared locations yet.</Text>
            <Text style={styles.emptySubText}>
              Add a location and toggle "Share with everyone"!
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: COLORS.primary,
  },
  emailText: { color: COLORS.white, fontSize: 13 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  locationName: { fontSize: 17, fontWeight: '700', color: COLORS.text, flex: 1 },
  sharedBy: { fontSize: 11, color: COLORS.textLight, fontStyle: 'italic' },
  description: { color: COLORS.darkText, marginVertical: 4, fontSize: 14 },
  empty: { alignItems: 'center', marginTop: 60 },
  emptyText: { fontSize: 18, color: COLORS.text, fontWeight: '600' },
  emptySubText: { color: COLORS.textLight, marginTop: 4, textAlign: 'center' },
});