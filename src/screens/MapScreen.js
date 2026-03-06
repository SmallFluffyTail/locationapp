import { useState, useEffect, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Text, TextInput, Button, ActivityIndicator } from 'react-native-paper';
import * as Location from 'expo-location';
import { COLORS } from '../theme/theme';

const DEFAULT_REGION = {
  latitude: 60.1699,
  longitude: 24.9384,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

export default function MapScreen({ route }) {
  const mapRef = useRef(null);
  const [region, setRegion] = useState(DEFAULT_REGION);
  const [marker, setMarker] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const locationName = route?.params?.locationName;
    if (locationName) {
      setSearchText(locationName);
      geocodeLocation(locationName);
    }
  }, [route?.params?.locationName]);

const geocodeLocation = async (name) => {
  const query = name || searchText;
  if (!query.trim()) {
    setError('Please enter a location name.');
    return;
  }
  setLoading(true);
  setError('');
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`,
      {
        headers: {
          'User-Agent': 'LocationApp/1.0', 
        },
      }
    );
    const data = await response.json();

    if (data.length > 0) {
      const latitude = parseFloat(data[0].lat);
      const longitude = parseFloat(data[0].lon);
      const newRegion = {
        latitude,
        longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      };
      setRegion(newRegion);
      setMarker({ latitude, longitude, name: query });
      mapRef.current?.animateToRegion(newRegion, 1000);
    } else {
      setError(`Location "${query}" not found.`);
    }
  } catch (e) {
    setError('Search failed. Check your connection.');
  } finally {
    setLoading(false);
  }
};

  return (
    <View style={styles.container}>
      {/* Search bar overlay */}
      <View style={styles.searchBox}>
        <TextInput
          value={searchText}
          onChangeText={setSearchText}
          mode="outlined"
          placeholder="Search location..."
          style={styles.searchInput}
          outlineColor={COLORS.border}
          activeOutlineColor={COLORS.primary}
          right={
            <TextInput.Icon
              icon="magnify"
              onPress={() => geocodeLocation()}
              color={COLORS.primary}
            />
          }
          onSubmitEditing={() => geocodeLocation()}
        />
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </View>

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      )}

      <MapView
        ref={mapRef}
        style={styles.map}
        region={region}
        provider={PROVIDER_GOOGLE}
        showsUserLocation
      >
        {marker && (
          <Marker
            coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
            title={marker.name}
            pinColor={COLORS.primary}
          />
        )}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  searchBox: {
    position: 'absolute',
    top: 12,
    left: 12,
    right: 12,
    zIndex: 10,
    backgroundColor: COLORS.surface,
    borderRadius: 10,
    padding: 8,
    elevation: 6,
  },
  searchInput: { backgroundColor: COLORS.surface },
  errorText: { color: COLORS.error, fontSize: 12, marginTop: 4, marginLeft: 8 },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.5)',
    zIndex: 20,
  },
});